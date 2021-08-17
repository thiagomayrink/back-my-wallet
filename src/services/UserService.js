import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UserRepository } from '../repositories/UserRepository.js';
import { SessionRepository } from '../repositories/SessionRepository.js';
import { validateUserPassword } from '../utils/utils.js';
import { signInSchema, signUpSchema } from '../schemas/userSchema.js';

export class UserService {
    constructor() {
        this.userRepository = new UserRepository();
        this.sessionRepository = new SessionRepository();
    }

    async checkExistingEmail(email) {
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

    async signUpUser(reqBody) {
        try {
            const status = {};
            // prettier-ignore
            const {
                name,
                email,
                password,
                err,
            } = UserService.validateSignUpInput(reqBody);
            if (err) {
                status.code = 400;
                return status;
            }
            const isExistingUser = await this.checkExistingEmail(reqBody.email);
            if (isExistingUser) {
                status.code = 409;
                return status;
            }

            const passwordHash = bcrypt.hashSync(password, 10);
            const isSaved = await this.userRepository.save(
                name,
                email,
                passwordHash,
            );
            if (isSaved) {
                status.code = 201;
                return status;
            }

            status.code = 400;
            return status;
        } catch (err) {
            return console.error('userService.signUpUser: ', err);
        }
    }

    async signInUser(reqBody) {
        const status = {};
        // prettier-ignore
        const {
            email,
            password,
            err,
        } = UserService.validateSignInInput(reqBody);

        if (err) {
            status.code = 401;
            return status;
        }
        const user = await this.userRepository.findUserByEmail(email);
        if (!user) {
            status.code = 401;
            return status;
        }

        const isValidPassword = validateUserPassword(password, user.password);
        if (isValidPassword) {
            const sessionData = await this.createSession(user);
            status.code = 200;
            status.session = sessionData;
            return status;
        }

        status.code = 401;
        return status;
    }

    async returnUserFromToken(token) {
        const user = await this.userRepository.findUserByToken(token);
        if (user) return user;

        return null;
    }

    async createSession(user) {
        try {
            const token = uuidv4();
            await this.sessionRepository.save(user.id, token);

            const userData = {
                user: { id: user.id, name: user.name, email: user.email },
                token,
            };

            return userData;
        } catch (err) {
            return console.error('userService.createSession: ', err);
        }
    }

    async removeSession(token) {
        try {
            const isSessionRemoved = await this.sessionRepository.end(token);
            return isSessionRemoved || false;
        } catch (err) {
            return console.error(err);
        }
    }

    static validateSignUpInput(reqBody) {
        const err = signUpSchema.validate(reqBody).error || false;
        const { name, email, password } = reqBody;

        const validatedBody = {
            name,
            email,
            password,
            err,
        };

        return validatedBody;
    }

    static validateSignInInput(reqBody) {
        const err = signInSchema.validate(reqBody).error || false;
        const { email, password } = reqBody;

        const validatedBody = {
            email,
            password,
            err,
        };

        return validatedBody;
    }
}
