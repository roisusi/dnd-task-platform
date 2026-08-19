import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Database connection (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('reads the seeded users from PostgreSQL', () => {
    return request(app.getHttpServer()).get('/users').expect(200);
  });

  afterAll(async () => {
    if (app !== undefined) {
      await app.close();
    }
  });
});
