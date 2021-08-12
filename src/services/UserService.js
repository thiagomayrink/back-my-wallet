import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UserRepository } from '../repositories/UserRepository.js';
import { SessionRepository } from '../repositories/SessionRepository.js';

export class UserService {
    constructor() {
        this.userRepository = new UserRepository();
        this.sessionRepository = new SessionRepository();
    }

    async checkExistingUser(email) {
        try {
            const isExistingUser = await this.userRepository.findUserByEmail(
                email,
            );

            if (isExistingUser) {
                return true;
            }
            return false;
        } catch (err) {
            return console.error('userService.isUserSignedUp: ', err);
        }
    }

    async signUpUser(name, email, password) {
        try {
            const passwordHash = bcrypt.hashSync(password, 10);
            await this.userRepository.save(name, email, passwordHash);
            return true;
        } catch (err) {
            return console.error('userService.signUpUser: ', err);
        }
    }

    async signInUser(user) {
        try {
            const token = uuidv4();
            await this.sessionRepository.save(user.id, token);

            const userData = {
                user: { id: user.id, name: user.name, email: user.email },
                token,
            };
            return userData;
        } catch (err) {
            return console.error('userService.signInUser: ', err);
        }
    }
}
