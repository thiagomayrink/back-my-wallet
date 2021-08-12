import { UserService } from '../services/UserService';

export class UserController {
    constructor() {
        this.userService = new UserService();
    }

    async signUp(req, res) {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) return res.sendStatus(400);

            const isExistingUser = await this.userService.checkExistingUser(
                email,
            );

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
}
