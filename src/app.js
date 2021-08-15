import express from 'express';
import cors from 'cors';
import { UserController } from './controllers/UserController.js';
import { TransactionController } from './controllers/TransactionController.js';
import { authMiddleware } from './middlewares/authMiddleware.js';

const userController = new UserController();
const transactionController = new TransactionController();
const app = express();

app.use(cors());
app.use(express.json());

app.post('/sign-up', userController.signUp.bind(userController));

app.post('/sign-in', userController.signIn.bind(userController));

app.post(
    '/sign-out',
    authMiddleware,
    userController.signOut.bind(userController),
);

app.post(
    '/transactions',
    authMiddleware,
    transactionController.perform.bind(transactionController),
);

app.get(
    '/transactions',
    authMiddleware,
    transactionController.getAll.bind(transactionController),
);

app.get(
    '/balance',
    authMiddleware,
    transactionController.balance.bind(transactionController),
);

export default app;
