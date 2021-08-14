import express from 'express';
import cors from 'cors';
import connection from './database/database.js';
import { UserController } from './controllers/UserController.js';

const userController = new UserController();
const app = express();

app.use(cors());
app.use(express.json());

app.post('/sign-up', userController.signUp.bind(userController));

app.post('/sign-in', userController.signIn.bind(userController));

app.post('/sign-out', userController.signOut.bind(userController));

app.post('/transactions', async (req, res) => {
    try {
        const { authorization } = req.headers;
        const { type: rawType, amount: rawAmount, description } = req.body;
        const token = authorization?.replace('Bearer ', '');
        const type = parseInt(rawType, 10);
        const amount = parseInt(rawAmount, 10);

        if (!authorization || !token) {
            return res.sendStatus(401);
        }

        if (type !== 0 && type !== 1) {
            return res.sendStatus(400);
        }

        if (!amount) {
            return res.sendStatus(400);
        }

        const { rows: user } = await connection.query(
            `
            SELECT * FROM sessions
            JOIN users
            ON sessions."userId" = users.id
            WHERE sessions.token = $1
        `,
            [token],
        );

        if (user.length === 0) {
            return res.sendStatus(401);
        }

        const { userId } = user[0];

        await connection.query(
            `
                INSERT INTO transactions 
                ("userId", amount, description, type, date)
                VALUES ($1, $2, $3, $4, NOW())
        `,
            [userId, amount, description, type],
        );

        return res.sendStatus(201);
    } catch (e) {
        console.error(e.error);
        return res.sendStatus(500);
    }
});

app.get('/transactions', async (req, res) => {
    try {
        const { authorization } = req.headers;
        const token = authorization?.replace('Bearer ', '');

        if (!authorization || !token) {
            return res.sendStatus(401);
        }

        const { rows: user } = await connection.query(
            `
            SELECT * FROM sessions
            JOIN users
            ON sessions."userId" = users.id
            WHERE sessions.token = $1
        `,
            [token],
        );

        if (user.length === 0) {
            return res.sendStatus(401);
        }

        const { userId } = user[0];

        const { rows: transactions } = await connection.query(
            `
            SELECT * FROM transactions
            WHERE "userId" = $1
        `,
            [userId],
        );

        return res.send(transactions);
    } catch (e) {
        console.error(e.error);
        return res.sendStatus(500);
    }
});

app.get('/balance', async (req, res) => {
    try {
        const { authorization } = req.headers;
        const token = authorization?.replace('Bearer ', '');
        if (!authorization || !token) {
            return res.sendStatus(401);
        }
        const { rows: user } = await connection.query(
            `
            SELECT * FROM sessions
            JOIN users
            ON sessions."userId" = users.id
            WHERE sessions.token = $1
        `,
            [token],
        );

        if (user.length === 0) {
            return res.sendStatus(401);
        }

        const { userId } = user[0];

        const { rows: transactions } = await connection.query(
            `
            SELECT * FROM transactions
            WHERE "userId" = $1
        `,
            [userId],
        );

        let balance = 0;
        for (let i = 0; i < transactions.length; i++) {
            if (transactions[i]?.type === 0) {
                balance += transactions[i]?.amount;
            } else if (transactions[i].type === 1) {
                balance += -transactions[i]?.amount;
            }
        }
        const data = { balance };
        return res.send(data).status(200);
    } catch (e) {
        console.error(e.error);
        return res.sendStatus(500);
    }
});

export default app;
