import jwt from 'jsonwebtoken';
import connection from '../../src/database/database.js';

import { createUser } from '../factories/userFactory.js';

export async function createToken(name, email, password) {
    const user = await createUser(name, email, password);

    const data = { userId: user.id };
    const secret = process.env.JWT_SECRET;
    const config = { expiresIn: 60 * 60 * 24 }; // 1 dia em segundos

    const token = jwt.sign(data, secret, config);

    await connection.query(
        `
      INSERT INTO sessions 
      ("userId", token)
      VALUES ($1, $2)
  `,
        [user.id, token],
    );

    return token;
}

export async function cleanDatabase() {
    await connection.query('TRUNCATE users RESTART IDENTITY CASCADE');
    await connection.query('TRUNCATE sessions RESTART IDENTITY CASCADE');
    await connection.query('TRUNCATE transactions RESTART IDENTITY CASCADE');
}

export async function closeConnection() {
    await connection.end();
}
