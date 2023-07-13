const express = require("express");
const http = require('http');
const socketio = require('socket.io');

const formatMsg = require('./utils/messages');
import { userJoin, getCurrentUser, userLeave, getRoomUsers } from './utils/users'

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
      origin: 'http://localhost:4201',
      methods: ['GET', 'POST'],
    },
  });
const cors = require('cors');

app.use(express.json());
app.use(cors({ origin: 'http://localhost:4201' }));

const botName = 'StageSpace bot';

//run when client connects
io.on('connection', socket => {
  //user joining the room
  socket.on('joinRoom', ({ username, room }) => {

    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    socket.emit('message', formatMsg(botName, 'Welcome to StageSpace!'));
    //broadcast when a user connects 
    socket.broadcast.to(user.room).emit('message', formatMsg(botName, `${user.username} has joined the chat!`));

    //send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    }); 
  });

  //listen for chat message
  socket.on('chatMessage', (message) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('message', formatMsg(user.username, message));
  });

  //runs when client disconnects 
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit('message', formatMsg(botName, `${user.username} has left the chat.`));
    }
    //send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    }); 
  });
});

server.listen(3001);