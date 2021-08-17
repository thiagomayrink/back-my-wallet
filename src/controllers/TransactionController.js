import { TransactionService } from '../services/TransactionService.js';
import { UserService } from '../services/UserService.js';

export class TransactionController {
    constructor() {
        this.transactionService = new TransactionService();
        this.userService = new UserService();
    }

    async perform(req, res) {
        try {
            const sanitizedBody = req.body;

            const status = await this.transactionService.process(
                sanitizedBody,
                req.userId,
            );

            if (status.code === 400) return res.sendStatus(400).end();
            if (status.code === 201) return res.sendStatus(201).end();

            return res.sendStatus(status.code).end();
        } catch (err) {
            console.error(err);
            return res.sendStatus(500).end();
        }
    }

    async returnAll(req, res) {
        try {
            const status = await this.transactionService.fetch(req.userId);

            if (status.transactions !== null) {
                return res.send(status.transactions).end();
            }
            return res.sendStatus(status.code).end();
        } catch (err) {
            console.error(err);
            return res.sendStatus(500).end();
        }
    }

    async balance(req, res) {
        try {
            const status = await this.transactionService.doBalance(req.userId);

            if (status.code === 200) {
                return res.send({ balance: status.balance }).status(200).end();
            }
            return res.sendStatus(status.code).end();
        } catch (err) {
            console.error(err);
            return res.sendStatus(500).end();
        }
    }
}
