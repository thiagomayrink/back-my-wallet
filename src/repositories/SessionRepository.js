import connection from '../database/database.js';

export class SessionRepository {
    constructor() {
        this.connection = connection;
    }

    async save(userId, token) {
        try {
            await this.connection.query(
                `
                    INSERT INTO sessions 
                    ("userId", token)
                    VALUES ($1, $2)
                `,
                [userId, token],
            );

            return true;
        } catch (err) {
            return console.error('userRepository.save: ', err);
        }
    }

    async end(token) {
        try {
            await this.connection.query(
                `
                    DELETE FROM sessions
                    WHERE token = $1
                `,
                [token],
            );

            return true;
        } catch (err) {
            return console.error('userRepository.end: ', err);
        }
    }

    // to be implemented in next feature
    async endAll(userId) {
        try {
            await this.connection.query(
                `
                    DELETE FROM sessions
                    WHERE "userId" = $1
                `,
                [userId],
            );

            return true;
        } catch (err) {
            return console.error('userRepository.endAll: ', err);
        }
    }
}
