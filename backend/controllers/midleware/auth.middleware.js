/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { request, response } from "express";
import { verifyToken } from "../utils/token.js";


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