import connection from '../database/database';

export class UserRepository {
    constructor() {
        this.connection = connection;
    }

    async findUserByEmail(email) {
        try {
            const { rows: users } = await this.connection.query(
                'SELECT * FROM users WHERE email = $1',
                [email],
            );

            return users[0];
        } catch (err) {
            return console.error('userRepository.findUserByEmail: ', err);
        }
    }

    async save(name, email, passwordHash) {
        try {
            await this.connection.query(
                `
                INSERT INTO users
                (name, email, password)
                VALUES ($1, $2, $3)
            `,
                [name, email, passwordHash],
            );

            return true;
        } catch (err) {
            return console.error('userRepository.save: ', err);
        }
    }
}
