import { stripHtml } from 'string-strip-html';
import { TransactionRepository } from '../repositories/TransactionRepository.js';
import { UserRepository } from '../repositories/UserRepository.js';
import { transactionSchema } from '../schemas/transactionSchema.js';

export class TransactionService {
    constructor() {
        this.transactionsRepository = new TransactionRepository();
        this.userRepository = new UserRepository();
        this.sanitizeTransactionBody = function sanitizeTransactionBody(
            reqBody,
        ) {
            const { type, amount } = reqBody;
            let { description } = reqBody;
            description = stripHtml(description).result.trim();

            return { type, amount, description };
        };

        this.validateTransactionInput = function validateTransactionInput(
            sanitizedInput,
        ) {
            // prettier-ignore
            const err = transactionSchema.validate(sanitizedInput).error || null;
            const { type, amount, description } = sanitizedInput;

            const validatedBody = {
                type,
                amount,
                description,
                err,
            };

            return validatedBody;
        };

        this.evaluateBalance = function evaluateBalance(transactions) {
            try {
                let balance = 0;
                for (let i = 0; i < transactions.length; i++) {
                    if (transactions[i]?.type === 0) {
                        balance += transactions[i]?.amount;
                    } else if (transactions[i].type === 1) {
                        balance += -transactions[i]?.amount;
                    }
                }
                return balance;
            } catch (err) {
                return console.error('evaluateBalance: ', err);
            }
        };
    }

    async process(transaction) {
        try {
            await this.transactionsRepository.save(transaction);
            return true;
        } catch (err) {
            return console.error(err);
        }
    }

    async fetch(userId) {
        const transactions = await this.transactionsRepository.findAllByUserId(
            userId,
        );
        return transactions;
    }

    doBalance(transactions) {
        const balance = this.evaluateBalance(transactions);
        return balance;
    }
}
