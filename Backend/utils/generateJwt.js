import jwt from 'jsonwebtoken';

export const generateJwt = (payload) => {

    const token = jwt.sign(payload, process.env.JWT_SECRET);

    return token;

}