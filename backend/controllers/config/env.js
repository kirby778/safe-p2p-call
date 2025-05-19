/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import dotenv from 'dotenv';

dotenv.config();


// SERVER
export const PORT =process.env.PORT ;
export const NODE_ENV =process.env.NODE_ENV ;
export const BASE_URL =process.env.BASE_URL ;
export const ALLOWED_ORIGIN =process.env.ALLOWED_ORIGIN ;

// Database
export const MONGO_DB_URL=process.env.DB_URL ;

// SMTP Configuration
export const SMTP_HOST= process.env.SMTP_HOST;
export const SMTP_PORT= process.env.SMTP_PORT;
export const SMTP_USERNAME= process.env.SMTP_USERNAME;
export const SMTP_PASSWORD= process.env.SMTP_PASSWORD;
export const SMTP_API_KEY= process.env.SMTP_API_KEY;




export const JWT_SECRET= process.env.JWT_SECRET;