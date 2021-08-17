import connection from '../database/database.js';

export class TransactionRepository {
    constructor() {
        this.connection = connection;
    }

    async save(transaction) {
        try {
            await this.connection.query(
                `
                    INSERT INTO transactions 
                    ("userId", amount, description, type, date)
                    VALUES ($1, $2, $3, $4, NOW())
            `,
                [
                    transaction.userId,
                    transaction.amount,
                    transaction.description,
                    transaction.type,
                ],
            );
            return true;
        } catch (err) {
            console.error('transactionRepository.save: ', err);
            return false;
        }
    }

    async findAllByUserId(userId) {
        try {
            const { rows: transactions } = await this.connection.query(
                `
                SELECT * FROM transactions
                WHERE "userId" = $1
            `,
                [userId],
            );

            return transactions;
        } catch (err) {
            console.error(err);
            return null;
        }
    }
}
