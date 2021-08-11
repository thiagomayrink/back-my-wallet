import { v4 as uuidv4 } from 'uuid';

import connection from '../../src/database/database.js';

import { createUser } from '../factories/userFactory.js';

export async function createToken (name, email, password) {
  const user = await createUser(name, email, password);
  const token = uuidv4();

  await connection.query(`
      INSERT INTO sessions 
      ("userId", token)
      VALUES ($1, $2)
  `, [user.id, token]);

  return token;
}

export async function cleanDatabase() {
  await connection.query(`TRUNCATE users RESTART IDENTITY`);
  await connection.query(`TRUNCATE sessions RESTART IDENTITY`);
  await connection.query(`TRUNCATE transactions RESTART IDENTITY`);
}

export async function closeConnection() {
  await connection.end();
}