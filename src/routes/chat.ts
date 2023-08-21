import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import * as socketio from 'socket.io';

//UTILS
import { formatMessage } from '../utils/messages';
import { userJoin, getCurrentUser, userLeave, getRoomUsers } from '../utils/users';
//

const app = express();

if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

app.use(express.json());
app.use(cors({ origin: 'http://localhost:4201' }));

export function chatSocket(server) {

    const io = new socketio.Server(server, {
        cors: {
        origin: 'http://localhost:4201',
        methods: ['GET', 'POST'],
        },
    });


    const botName = 'StageSpace bot';
    let socketUser;


    //CHAT STUFF
    //CHAT STUFF
    //CHAT STUFF
    //CHAT STUFF
    //CHAT STUFF
    
    io.use((socket, next) => {
        const token = socket.handshake.query.token;
        //verify user by token
        if (token == null) return next(new Error('Authentication failed'));
        if (typeof(token) === 'string') {
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
                if (err) return next(new Error('Authentication failed'));
                socketUser = user;
                next();
            });
        }
    });

    //run when client connects
    io.on('connection', socket => {
        //user joining the room
        socket.on('joinRoom', ({ room }) => {
            const username = socketUser.name;
            const user = userJoin(socket.id, username, room);

            socket.join(user.room);
        
            socket.emit('message', formatMessage(botName, 'Welcome to StageSpace!'));
            //broadcast when a user connects 
            socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat!`));
        
            //send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            }); 
        });
    
        //listen for chat message
        socket.on('chatMessage', async (message) => {
            const user = getCurrentUser(socket.id);
            io.to(user.room).emit('message', formatMessage(user.username, message));
        });
    
        //listen for file massage
        socket.on('fileMessage', (obj) => {
            const user = getCurrentUser(socket.id);
            io.to(user.room).emit('message-photo', {message: formatMessage(user.username, obj.fileName), photo: obj});
        })
    
        //runs when client disconnects 
        socket.on('disconnect', () => {
            const user = userLeave(socket.id);
            if (user) {
                io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat.`));
            }
            //send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            }); 
        });
    });
}