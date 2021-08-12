import connection from '../database/database';

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
            console.error('userRepository.save: ', err);
            return null;
        }
    }
}
