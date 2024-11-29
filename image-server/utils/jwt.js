import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;

export const generateJwt = (payload, expire = '24h') => {
    return jwt.sign(payload, secret, { expiresIn: expire });
}

export const verifyJwt = (token) => {
    try {
        jwt.verify(token, secret);
        return true;
    } catch (e) {
        return false;
    }
}

export const decodeJwt = (token) => {
    return jwt.decode(token);
}

