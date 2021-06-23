import express from 'express';
import cors from 'cors';
import connection from './database/database.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(cors());
app.use(express.json());

app.post("/sign-up", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const {rows:users} = await connection.query(`SELECT * FROM users`);
        if (users.some(c => c['email'] === email)){
          return res.sendStatus(409);
        };
        if (name && email && password){
            const passwordHash = bcrypt.hashSync(password, 12);
            await connection.query(`
            INSERT INTO users
            (name, email, password)
            VALUES ($1, $2, $3)
        `,[name, email, passwordHash]);
        } else {
            return res.sendStatus(400);
        }
        return res.sendStatus(201);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

app.post("/sign-in", async (req, res) => {
    try {
        const { email, password } = req.body;
    
        const result = await connection.query(`
            SELECT * FROM users
            WHERE email = $1
        `,[email]);
        const user = result.rows[0];

        if(user && bcrypt.compareSync(password, user.password)) {
            const token = uuidv4();
            await connection.query(`
                INSERT INTO sessions 
                ("userId", token)
                VALUES ($1, $2)
            `, [user.id, token])
        
            const data = {
                user: {id: user.id, name: user.name, email: user.email}, 
                token
            }
            return res.send(data).status(200);
        } else {
            return res.sendStatus(401);
        }
    } catch(e){
        console.log(e);
        return res.sendStatus(500);
    }
});
app.listen(4000, () => console.log('Server listening on port: 4000'));