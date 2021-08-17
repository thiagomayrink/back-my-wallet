import { stripHtml } from 'string-strip-html';

export function sanitizingMiddleware(req, res, next) {
    try {
        const { body } = req;
        const sanitizedBody = {};

        Object.keys(body).forEach(item => {
            const value = body[item];

            if (typeof value !== 'string') {
                sanitizedBody[item] = value;
                return sanitizedBody[item];
            }
            const itemNotTags = stripHtml(body[item].toString()).result;
            sanitizedBody[item] = itemNotTags;

            return sanitizedBody[item];
        });

        req.body = sanitizedBody;
        return next();
    } catch (err) {
        console.error('authMiddleware: ', err);
        return res.sendStatus(500).end();
    }
}
