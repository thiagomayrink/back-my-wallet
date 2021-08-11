import connection from "../../src/database/database.js";
import bcrypt from 'bcrypt';

export async function createUser(name, email, password) {
    const passwordHash = bcrypt.hashSync(password, 10);

    const {rows: user} = await connection.query(`
        INSERT INTO users 
        (name, email, password) 
        VALUES ($1, $2, $3)
        RETURNING *
    `, [name, email, passwordHash]);
    return user[0];
}

