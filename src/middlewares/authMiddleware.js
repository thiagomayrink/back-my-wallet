import jwt from 'jsonwebtoken';
import { fetchToken } from '../utils/utils.js';

export async function authMiddleware(req, res, next) {
    try {
        const secret = process.env.JWT_SECRET;
        const user = {};

        const token = fetchToken(req.headers);
        if (!token) return res.sendStatus(401).end();
        try {
            const data = jwt.verify(token, secret);
            user.id = data.userId;
        } catch {
            return res.sendStatus(401).end();
        }
        if (!user.id) return res.sendStatus(401).end();

        req.userId = user.id;
        req.token = token;

        return next();
    } catch (err) {
        console.error('authMiddleware: ', err);
        return res.sendStatus(500).end();
    }
}
