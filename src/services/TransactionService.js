import { TransactionRepository } from '../repositories/TransactionRepository.js';
import { UserRepository } from '../repositories/UserRepository.js';
import { transactionSchema } from '../schemas/transactionSchema.js';

export class TransactionService {
    constructor() {
        this.transactionsRepository = new TransactionRepository();
        this.userRepository = new UserRepository();
    }

    async process(sanitizedBody, userId) {
        const status = {};
        try {
            // prettier-ignore
            const {
                type, amount, description, err,
            } = TransactionService.validateTransactionInput(sanitizedBody);

            if (err) {
                status.code = 400;
                return status;
            }

            const transaction = {
                userId,
                amount,
                description,
                type,
            };

            const isSaved = await this.transactionsRepository.save(transaction);
            if (isSaved) {
                status.code = 201;
                return status;
            }

            status.code = 500;
            return status;
        } catch (err) {
            console.error(err);
            status.code = 500;
            return status;
        }
    }

    async fetch(userId) {
        const status = {};
        try {
            if (!userId) {
                status.code = 500;
                status.transactions = null;
                return status;
            }
            // prettier-ignore
            const transactions = await this.transactionsRepository.findAllByUserId(userId);

            if (transactions !== null) {
                status.code = 200;
                status.transactions = transactions;
                return status;
            }

            status.code = 400;
            status.transactions = null;
            return status;
        } catch (err) {
            console.error('transactionService.fetch: ', err);
            status.code = 500;
            return status;
        }
    }

    async doBalance(userId) {
        const status = {};
        try {
            const { transactions } = await this.fetch(userId);
            if (!transactions) {
                status.code = 401;
                return status;
            }

            let balance = 0;
            for (let i = 0; i < transactions.length; i++) {
                if (transactions[i]?.type === 0) {
                    balance += transactions[i]?.amount;
                } else if (transactions[i].type === 1) {
                    balance += -transactions[i]?.amount;
                }
            }
            if (typeof balance === 'number') {
                status.code = 200;
                status.balance = balance;
                return status;
            }
            status.code = 401;
            return status;
        } catch (err) {
            console.error('evaluateBalance: ', err);
            status.code = 500;
            return status;
        }
    }

    static validateTransactionInput(sanitizedBody) {
        // prettier-ignore
        const err = transactionSchema.validate(sanitizedBody).error || false;
        const { type, amount, description } = sanitizedBody;

        const validatedBody = {
            type,
            amount,
            description,
            err,
        };

        return validatedBody;
    }
}
