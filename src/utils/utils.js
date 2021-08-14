import bcrypt from 'bcrypt';

export function validateUserAndPassword(password, user) {
    try {
        if (user && bcrypt.compareSync(password, user.password)) {
            return true;
        }
        return false;
    } catch (err) {
        return console.error('validatePassword: ', err);
    }
}

export function fetchToken(headers) {
    const { authorization } = headers;
    const token = authorization?.replace('Bearer', '').trim();
    return token;
}
