import 'dotenv/config';
import { connect, model } from 'mongoose';
import { CodeSchema } from '../domain/code/code.schema';
import { PlayerSchema } from '../domain/player/player.schema';
import { EmployeeSchema } from '../domain/employee/employee.schema';

async function seed() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  await connect(mongoUri);

  const Code = model('Code', CodeSchema);
  const Player = model('Player', PlayerSchema);
  const Employee = model('Employee', EmployeeSchema);

  // Sample codes
  await Code.deleteMany({});
  await Code.insertMany([
    { code: 'ABC123' },
    { code: 'XYZ789' },
    { code: 'TEST01' },
    { code: 'CODE04' },
    { code: 'CODE05' },
    { code: 'CODE06' },
    { code: 'CODE07' },
    { code: 'CODE08' },
    { code: 'CODE09' },
    { code: 'CODE10' },
  ]);

  // Sample employees
  await Employee.deleteMany({});
  await Employee.insertMany([
    { name: 'John Doe' },
    { name: 'Jane Smith' },
    { name: 'Alice Johnson' },
    { name: 'Bob Brown' },
    { name: 'Charlie Black' },
    { name: 'Diana White' },
    { name: 'Eve Green' },
    { name: 'Frank Blue' },
    { name: 'Grace Red' },
    { name: 'Hank Yellow' },
  ]);

  // Sample players
  await Player.deleteMany({});
  const employees = await Employee.find({});
  const empMap = Object.fromEntries(employees.map(e => [e.name, e._id]));
  const empIds = employees.map(e => e._id);
  const playerNames = [
    'Alice', 'Bob', 'Carol', 'Dave', 'Ethan', 'Fiona', 'Gabe', 'Hannah', 'Ivan', 'Julia',
    'Kevin', 'Lila', 'Mason', 'Nina', 'Owen', 'Paula', 'Quinn', 'Rosa', 'Sam', 'Tina'
  ];
  const playerData = Array.from({ length: 20 }, (_, idx) => {
    const code = idx < 10
      ? [
          'ABC123', 'XYZ789', 'TEST01', 'CODE04', 'CODE05',
          'CODE06', 'CODE07', 'CODE08', 'CODE09', 'CODE10',
        ][idx]
      : `CODE${(idx + 1).toString().padStart(2, '0')}`;
    const nickname = playerNames[idx];
    const anonymous = idx % 4 === 0; // every 4th player is anonymous
    // Randomly select 8 unique employees for picks
    const shuffledEmpIds = empIds.slice().sort(() => Math.random() - 0.5);
    const picks = Array.from({ length: 8 }, (_, j) => {
      const empId = shuffledEmpIds[j % shuffledEmpIds.length];
      const cause = Math.random() < 0.5 ? 'voluntary' : 'fired';
      return { employee: empId, cause };
    });
    return {
      code,
      nickname,
      anonymous,
      picks,
      picksLockedAt: new Date(),
    };
  });
  await Player.insertMany(playerData);
  // Mark used codes
  const usedCodes = playerData.map(p => p.code);
  await Code.updateMany({ code: { $in: usedCodes } }, { $set: { used: true } });

  // Mark 4 employees as departed with different causes
  const now = new Date();
  await Employee.updateOne({ name: 'John Doe' }, { $set: { departureDate: now, departureCause: 'voluntary', active: false } });
  await Employee.updateOne({ name: 'Jane Smith' }, { $set: { departureDate: new Date(now.getTime() - 86400000), departureCause: 'fired', active: false } });
  await Employee.updateOne({ name: 'Alice Johnson' }, { $set: { departureDate: new Date(now.getTime() - 2 * 86400000), departureCause: 'voluntary', active: false } });
  await Employee.updateOne({ name: 'Bob Brown' }, { $set: { departureDate: new Date(now.getTime() - 3 * 86400000), departureCause: 'fired', active: false } });

  console.log('Database seeded!');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
