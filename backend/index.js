/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import express, { json } from 'express'
import {createServer} from 'node:http'
import { Server } from 'socket.io';
import { PORT } from './controllers/config/env.js';
import { connectDB } from './controllers/config/connectDb.js';
import authRouter from './controllers/routes/auth.js';
import morgan from 'morgan';
import { cors } from './controllers/config/cors.js';


const app = express();
const port =PORT || 4000;
app.use(morgan('dev'));
app.use(cors);
app.use(json())

const server= createServer(app).listen(port) ;

await connectDB();



const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['POST', 'GET', 'DELETE', 'PUT']
    }
});


app.use('/api' ,authRouter)



console.log(`listening to Port ${port}`);


