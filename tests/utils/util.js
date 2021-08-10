import supertest from 'supertest';
import app from '../../src/app.js';
import connection from '../../src/database/database.js';

export async function login () {
  await supertest(app).post("/sign-up").send({ name: 'teste', email: 'teste@email.com', password: '123456' });
  const user = await supertest(app).post("/sign-in").send({ email: 'teste@email.com', password: '123456' });
  
  return user.body.token;
}

export async function cleanDatabase() {
  await connection.query(`TRUNCATE users RESTART IDENTITY`);
  await connection.query(`TRUNCATE sessions RESTART IDENTITY`);
  await connection.query(`TRUNCATE transactions RESTART IDENTITY`);
}

export async function closeConnection() {
  await connection.end();
}