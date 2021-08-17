import bcrypt from 'bcrypt';

export function validateUserPassword(password, userPassword) {
    try {
        if (bcrypt.compareSync(password, userPassword)) {
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
