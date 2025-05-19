/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import express, { json } from 'express'
import {createServer} from 'node:http'
import { Server } from 'socket.io';
import { PORT } from './controllers/config/env.js';
import { connectDB } from './controllers/config/connectDb.js';
import authRouter from './controllers/routes/auth.js';
import morgan from 'morgan';
import { cors } from './controllers/config/cors.js';
import { User } from './models/User.js';
import CallingRoom from './models/CallingRoom.js';
import { rootCertificates } from 'node:tls';
import { socketMiddleware } from './controllers/midleware/auth.middleware.js';


const app = express();
const port =PORT || 4000;
app.use(morgan('dev'));
app.use(cors);
app.use(json())

const server= createServer(app).listen(port) ;
app.use('/api' ,authRouter)
await connectDB();

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['POST', 'GET', 'DELETE', 'PUT']
    }
});


let videoCaliingIo = io.of('/video-calling-io');

videoCaliingIo.use(socketMiddleware);


videoCaliingIo.on('connection' , function(socket) {
    socket.emit('connected' , { data : null});

    socket.on('find-caller-peerId', async (id) => {
        let user = await User.findOne({ id });
        if (user) {
            let socket_id = user.socket_ids.video_calling_socket;
            if (socket_id) videoCaliingIo.to(socket_id).emit('give-peer-details', { data: { userId: socket.userId } });
            socket.emit('offline-contact' , { data: { userId: id } })
        } else {
            socket.emit('invalid-contact-id', { data: { userId: id } })
        }
    });


    socket.on('peer-details' , async function(contactId , signal) {
        let user =await User.findOne({ id :contactId}) ;
        if (user) {
            let room = CallingRoom.create({
                contact_id : socket.userId ,
                callerId : contactId,
            });

            socket.join(room.roomId);

            io.to(user.socket_ids.video_calling_socket).emit('call-now' , { data : { signal , userId : socket.userId }})
        }
    });

    socket.on('called' , (roomId) => {
        socket.join(roomId)
    });


    socket.emit('call-end' , async (contact_id , roomId) => {
        socket.broadcast.to(roomId).emit('end-call' , roomId );
        socket.leave(roomId)
    });

    socket.emit('leave-call-last' , async (roomId) => {
        socket.leave(roomId);
    });

});



console.log(`Server Started Alhamdulillah`);