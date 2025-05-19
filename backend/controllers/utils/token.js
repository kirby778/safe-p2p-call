/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import jwt from 'jsonwebtoken'
import { JWT_EXPIRES_IN, JWT_SECRET} from '../config/env.js';

export function generateToken(userId){
    return jwt.sign(
        { userId: userId.toString() },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN}
    );
};


export function verifyToken (token) {
    try {
        return jwt.verify(token, JWT_SECRET) ;
    } catch (error) {
        return null;
    }
};