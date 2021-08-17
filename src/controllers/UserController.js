import { UserService } from '../services/UserService.js';

export class UserController {
    constructor() {
        this.userService = new UserService();
    }

    // Refatorar => sanitizar no middleware + Passar req para o service e fazer as validações lá
    async signUp(req, res) {
        try {
            const sanitizedBody = req.body;
            const status = await this.userService.signUpUser(sanitizedBody);

            if (status.code === 400) return res.sendStatus(400).end();
            if (status.code === 409) return res.sendStatus(409).end();
            if (status.code === 201) return res.sendStatus(201).end();

            return res.sendStatus(400).end();
        } catch (err) {
            console.error('userController.signUp: ', err);
            return res.sendStatus(500).end();
        }
    }

    async signIn(req, res) {
        try {
            const sanitizedBody = req.body;
            const status = await this.userService.signInUser(sanitizedBody);
            if (status.code === 401) return res.sendStatus(401).end();
            // prettier-ignore
            if (status.code === 200) return res.send(status.session).status(200).end();

            return res.sendStatus(400).end();
        } catch (err) {
            console.error('userController.signIn: ', err);
            return res.sendStatus(500).end();
        }
    }

    async signOut(req, res) {
        try {
            const { token } = req.token;

            const status = await this.userService.removeSession(token);
            if (status.code === 200) return res.sendStatus(200).end();

            return res.sendStatus(status.code).end();
        } catch (err) {
            console.error(err);
            return res.sendStatus(500).end();
        }
    }
}
