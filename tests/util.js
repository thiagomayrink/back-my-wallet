import supertest from 'supertest';
import app from '../src/app.js';

export async function login () {
  await supertest(app).post("/sign-up").send({ name: 'teste', email: 'teste@email.com', password: '123456' });
  const user = await supertest(app).post("/sign-in").send({ email: 'teste@email.com', password: '123456' });

  return user.body.token;
}