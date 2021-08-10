import connection from "../../src/database/database.js";

export async function createUser(name, email, password) {
    await connection.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`, [name, email, password]);
}

