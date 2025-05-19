/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { request, response } from "express";
import { verifyToken } from "../utils/token.js";
import { Socket } from "socket.io";
import { User } from "../../models/User.js";


export function authMiddleware(req=request, res=response, next) {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) 
            return res.status(401).json({ success: false, message: 'Authorization header required' });
        
        // Extract token
        const token = authHeader.split(' ')[1];
        
        // Verify token
        const decoded = verifyToken(token);
        if (!decoded) return res.status(401).json({ success: false, message: 'Invalid or expired token' });
        
        // Attach user ID to request
        req.userId = decoded.userId;
        
        next();
    } catch (error) {
        console.error(error);
        
        return res.status(401).json({ success: false, message: 'Authentication failed' });
    }
};



export async function socketMiddleware(socket , next) {
    try {
        let token = socket.handshake.auth.token;
        
        if (typeof token !== 'string' || !token) {
            next(new Error('No Auth Token'))
        }
        const decoded = verifyToken(token);
        if (!decoded) return res.status(401).json({ success: false, message: 'Invalid or expired token' });
        
        // Attach user ID to request
        socket.userId = decoded.userId;
        let user = await User.findOneAndUpdate(
            { id: decoded.userId },
            {
                "socket_ids.video_calling_socket": socket.id,
                status: 'online'
            }
        );
        if (!user) {
            next('Could not find User Account to Authenticate')
        }
        next();
    } catch (error) {
        next(new Error('Failed To Authenticate'));
    }
}