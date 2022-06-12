import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Auth Controller (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    jest.setTimeout(60000);
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a singup request', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({email: 'fff@your-mail.de', password: 'pass'})
      .expect(201)
      .then(res => {
        const {id, email} = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(email);
      });
  });

  it('signin test here', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({email: 'fff@your-mail.de', password: 'pass'})
      .expect(201)
      .then(res => {
        const {id, email} = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(email);
      });
  });
});
