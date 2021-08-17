import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
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
        const status = {};
        try {
            // prettier-ignore
            const {
                name, email, password, err,
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
            console.error('userService.signUpUser: ', err);
            status.code = 500;
            status.message = 'Internal Server Error';
            return status;
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
            if (!sessionData) {
                status.code = 500;
                return status;
            }
            status.code = 200;
            status.session = sessionData;
            return status;
        }

        status.code = 401;
        return status;
    }

    // async returnUserFromToken(token) {
    //     const user = await this.userRepository.findUserByToken(token);
    //     if (user) return user;

    //     return null;
    // }

    async createSession(user) {
        try {
            const data = { userId: user.id };
            const secret = process.env.JWT_SECRET;
            const config = { expiresIn: 60 * 60 * 24 }; // 1 dia em segundos

            const token = jwt.sign(data, secret, config);
            await this.sessionRepository.save(user.id, token);

            const userData = {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
                token,
            };
            return userData;
        } catch (err) {
            console.error('userService.createSession: ', err);
            return null;
        }
    }

    async removeSession(token) {
        const status = {};
        try {
            const isSessionRemoved = await this.sessionRepository.end(token);
            if (isSessionRemoved) {
                status.code = 200;
                return status;
            }
            status.core = 401;
            return status;
        } catch (err) {
            console.error('removeSession: ', err);
            status.core = 500;
            return status;
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
