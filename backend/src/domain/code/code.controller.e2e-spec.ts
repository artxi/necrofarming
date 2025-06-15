import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { disconnect } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

jest.setTimeout(20000);

describe('CodeController (e2e) with in-memory MongoDB', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongoServer.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await disconnect();
    await mongoServer.stop();
  });

  it('should claim a code and create a player', async () => {
    const res = await request(app.getHttpServer())
      .post('/code/claim')
      .send({ code: 'TEST01', nickname: 'TestUser', anonymous: false });
    expect(res.status).toBe(201);
    expect(res.body.player).toBeDefined();
    expect(res.body.player.nickname).toBe('TestUser');
    expect(res.body.alreadyUsed).toBe(false);
  });

  it('should return existing player if code is already used', async () => {
    await request(app.getHttpServer())
      .post('/code/claim')
      .send({ code: 'TEST01', nickname: 'TestUser', anonymous: false });
    const res = await request(app.getHttpServer())
      .post('/code/claim')
      .send({ code: 'TEST01' });
    expect(res.status).toBe(201);
    expect(res.body.player).toBeDefined();
    expect(res.body.alreadyUsed).toBe(true);
  });

  it('should return 400 for invalid code', async () => {
    const res = await request(app.getHttpServer())
      .post('/code/claim')
      .send({ code: 'INVALID' });
    expect(res.status).toBe(400);
  });
});
