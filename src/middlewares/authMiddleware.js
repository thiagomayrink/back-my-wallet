import { UserService } from '../services/UserService.js';
import { fetchToken } from '../utils/utils.js';

// fazer token com jwt! buscar userId do token!
export async function authMiddleware(req, res, next) {
    const userService = new UserService();
    try {
        const token = fetchToken(req.headers);
        if (!token) return res.sendStatus(401);

        const user = await userService.returnUserFromToken(token);
        if (!user) return res.sendStatus(401);

        res.locals.session = { user, token };
        return next();
    } catch (err) {
        console.error('authMiddleware: ', err);
        return res.sendStatus(500);
    }
}
