import { UserService } from '../services/UserService.js';
import { UserRepository } from '../repositories/UserRepository.js';
import { fetchToken } from '../utils/utils.js';

export class UserController {
    constructor() {
        this.userService = new UserService();
        this.userRepository = new UserRepository();
    }

    async signUp(req, res) {
        try {
            const sanitizedInput = this.userService.sanitizeSignUpBody(
                req.body,
            );
            // prettier-ignore
            const {
                name, email, password, err,
            } = this.userService.validateSignUpInput(sanitizedInput);

            if (err) return res.sendStatus(400);

            // prettier-ignore
            const isExistingUser = await this.userService.checkExistingEmail(email);

            if (isExistingUser) {
                return res.sendStatus(409);
            }

            if (name && email && password) {
                await this.userService.signUpUser(name, email, password);
                return res.sendStatus(201);
            }

            return res.sendStatus(400);
        } catch (err) {
            console.error('userController.signUp: ', err);
            return res.sendStatus(500);
        }
    }

    async signIn(req, res) {
        try {
            const sanitizedInput = this.userService.sanitizeSignInBody(
                req.body,
            );
            // prettier-ignore
            const {
                email, password, err,
            } = this.userService.validateSignInInput(sanitizedInput);

            if (err) return res.sendStatus(401);

            // prettier-ignore
            const user = await this.userService.validateSignInInputReturningUser(email, password);
            if (!user) return res.sendStatus(401);

            if (user) {
                const sessionData = await this.userService.createSession(user);
                return res.send(sessionData).status(200);
            }

            return res.sendStatus(400);
        } catch (err) {
            console.error('userController.signIn: ', err);
            return res.sendStatus(500);
        }
    }

    async signOut(req, res) {
        try {
            const token = fetchToken(req.headers);
            if (!token) return res.sendStatus(401);

            const isSessionRemoved = await this.userService.removeSession(
                token,
            );
            if (isSessionRemoved) return res.sendStatus(200);

            return res.sendStatus(500);
        } catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }
    }
}
