import { UserService } from '../services/UserService';
import { UserRepository } from '../repositories/UserRepository.js';

export class UserController {
    constructor() {
        this.userService = new UserService();
        this.userRepository = new UserRepository();
    }

    async signUp(req, res) {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) return res.sendStatus(400);

            // prettier-ignore
            const isExistingUser = await this.userService.checkExistingUser(email);

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
            const { email, password } = req.body;

            if (!email || !password) return res.sendStatus(400);

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
}
