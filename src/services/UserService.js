import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/UserRepository.js';

export class UserService {
    constructor() {
        this.userRepository = new UserRepository();
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
}
