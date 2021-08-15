import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { stripHtml } from 'string-strip-html';
import { UserRepository } from '../repositories/UserRepository.js';
import { SessionRepository } from '../repositories/SessionRepository.js';
import { validateUserAndPassword } from '../utils/utils.js';
import { signInSchema, signUpSchema } from '../schemas/userSchema.js';

export class UserService {
    constructor() {
        this.userRepository = new UserRepository();
        this.sessionRepository = new SessionRepository();
        this.sanitizeSignUpBody = function sanitizeSignUpBody(reqBody) {
            let { name, email, password } = reqBody;

            name = stripHtml(name).result.trim();
            email = stripHtml(email).result.trim();
            password = stripHtml(password).result.trim();

            return { name, email, password };
        };
        this.validateSignUpInput = function validateSignUpInput(
            sanitizedInput,
        ) {
            const err = signUpSchema.validate(sanitizedInput).error || null;
            const { name, email, password } = sanitizedInput;

            const validatedBody = {
                name,
                email,
                password,
                err,
            };

            return validatedBody;
        };
        this.sanitizeSignInBody = function sanitizeSignInBody(reqBody) {
            let { email, password } = reqBody;

            email = stripHtml(email).result.trim();
            password = stripHtml(password).result.trim();

            return { email, password };
        };
        this.validateSignInInput = function validateSignInInput(
            sanitizedInput,
        ) {
            const err = signInSchema.validate(sanitizedInput).error || null;
            const { email, password } = sanitizedInput;

            const validatedBody = {
                email,
                password,
                err,
            };

            return validatedBody;
        };
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

    async signUpUser(name, email, password) {
        try {
            const passwordHash = bcrypt.hashSync(password, 10);
            await this.userRepository.save(name, email, passwordHash);

            return true;
        } catch (err) {
            return console.error('userService.signUpUser: ', err);
        }
    }

    async validateSignInInputReturningUser(email, password) {
        const user = await this.userRepository.findUserByEmail(email);
        if (!user) return false;

        const isValidPassword = validateUserAndPassword(password, user);
        if (isValidPassword) return user;

        return null;
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
}
