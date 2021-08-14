import { TransactionService } from '../services/TransactionService';
import { UserService } from '../services/UserService';
import { fetchToken } from '../utils/utils';

export class TransactionController {
    constructor() {
        this.transactionService = new TransactionService();
        this.userService = new UserService();
    }

    async perform(req, res) {
        try {
            const token = fetchToken(req.headers);
            if (!token) return res.sendStatus(401);

            const { type, amount, description } = req.body;

            if (type !== 0 && type !== 1) return res.sendStatus(400);
            if (!amount) return res.sendStatus(400);

            const user = await this.userService.returnUserFromToken(token);

            if (!user) return res.sendStatus(401);

            const transaction = {
                userId: user.id,
                amount,
                description,
                type,
            };

            const isProcessed = await this.transactionService.process(
                transaction,
            );

            if (isProcessed) return res.sendStatus(201);
            return res.sendStatus(400);
        } catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }
    }

    async getAll(req, res) {
        try {
            const token = fetchToken(req.headers);
            if (!token) return res.sendStatus(401);

            const user = await this.userService.returnUserFromToken(token);

            if (!user) return res.sendStatus(401);

            const transactions = await this.transactionService.fetch(user.id);

            return res.send(transactions);
        } catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }
    }

    async balance(req, res) {
        try {
            const token = fetchToken(req.headers);
            if (!token) return res.sendStatus(401);

            const user = await this.userService.returnUserFromToken(token);

            if (!user) return res.sendStatus(401);

            const transactions = await this.transactionService.fetch(user.id);

            const balance = this.transactionService.doBalance(transactions);

            return res.send({ balance }).status(200);
        } catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }
    }
}
