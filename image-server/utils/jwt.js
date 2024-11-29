import jwt from 'jsonwebtoken';


export const generateJwt = (payload, expire = '24h') => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: expire });
}

export const verifyJwt = (token) => {
    try {
        jwt.verify(token, process.env.JWT_SECRET);
        return true;
    } catch (e) {
        return false;
    }
}

export const decodeJwt = (token) => {
    return jwt.decode(token);
}

