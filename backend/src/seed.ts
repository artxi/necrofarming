import 'dotenv/config';
import { connect, model } from 'mongoose';
import { CodeSchema } from './domain/code/code.schema';
import { PlayerSchema } from './domain/player/player.schema';

async function seed() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  await connect(mongoUri);

  const Code = model('Code', CodeSchema);
  const Player = model('Player', PlayerSchema);

  // Sample codes
  await Code.deleteMany({});
  await Code.insertMany([
    { code: 'ABC123' },
    { code: 'XYZ789' },
    { code: 'TEST01' },
  ]);

  // Sample players
  await Player.deleteMany({});
  await Player.insertMany([
    { code: 'ABC123', nickname: 'Alice', anonymous: false, guesses: [] },
    { code: 'XYZ789', nickname: 'Bob', anonymous: true, guesses: [] },
  ]);

  console.log('Database seeded!');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
