import express from 'express';
import cors from 'cors';
import { UserController } from './controllers/UserController.js';
import { TransactionController } from './controllers/TransactionController.js';
import { authMiddleware } from './middlewares/authMiddleware.js';
import { sanitizingMiddleware } from './middlewares/sanitizingMiddleware.js';

const userController = new UserController();
const transactionController = new TransactionController();
const app = express();

app.use(cors());
app.use(express.json());

app.post(
    '/sign-up',
    sanitizingMiddleware,
    userController.signUp.bind(userController),
);

app.post(
    '/sign-in',
    sanitizingMiddleware,
    userController.signIn.bind(userController),
);

app.post(
    '/sign-out',
    sanitizingMiddleware,
    authMiddleware,
    userController.signOut.bind(userController),
);

app.post(
    '/transactions',
    sanitizingMiddleware,
    authMiddleware,
    transactionController.perform.bind(transactionController),
);

app.get(
    '/transactions',
    sanitizingMiddleware,
    authMiddleware,
    transactionController.returnAll.bind(transactionController),
);

app.get(
    '/balance',
    sanitizingMiddleware,
    authMiddleware,
    transactionController.balance.bind(transactionController),
);

export default app;
