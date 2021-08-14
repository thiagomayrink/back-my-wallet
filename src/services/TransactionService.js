import { TransactionRepository } from '../repositories/TransactionRepository';
import { UserRepository } from '../repositories/UserRepository';

export class TransactionService {
    constructor() {
        this.transactionsRepository = new TransactionRepository();
        this.userRepository = new UserRepository();
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
