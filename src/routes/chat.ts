import express from 'express';
import jwt from 'jsonwebtoken';
import * as socketio from 'socket.io';

//DATABASE
import { mongRoom } from '../schemas/rooms';
import { mongMessage } from '../schemas/messages';
import { mongUser } from '../schemas/users';
//

//UTILS
import { formatMessage, formatPreviousMessages, formatImage } from '../utils/messages';
//

const app = express();

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

app.use(express.json());

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
        if (typeof (token) === 'string') {
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
                if (err) return next(new Error('Authentication failed'));
                socketUser = user;
                next();
            });
        }
    });



    //run when client connects
    io.on('connection', socket => {
        let roomId, sender, receiver;
        //user joining the room
        socket.on('joinRoom', async ({ receiverId }) => {
            const senderId = socketUser.id;
            //const user = userJoin(socket.id, username, room);
            try {
                const theRoom = await mongRoom.findOne({ participants: { $all: [senderId, receiverId] } });
                if (theRoom) {
                    roomId = theRoom._id;
                } else {
                    //create new room in the db
                    const newRoom = new mongRoom({
                        participants: [senderId, receiverId],
                    });
                    await newRoom.save();

                    roomId = newRoom._id;
                }
                //join the room
                roomId = roomId.toString();
                socket.join(roomId);

                //get users from another collection
                const roomWithParticipants = await mongRoom.findById(roomId)
                    .populate('participants', 'email username');

                console.log(roomWithParticipants);

                //initialize users
                //sender = roomWithParticipants.participants[0];
                //receiver = roomWithParticipants.participants[1];

                sender = await mongUser.findOne({ _id: senderId }).select('email username');
                receiver = await mongUser.findOne({ _id: receiverId }).select('email username');

                console.log(sender, receiver);

                //bot greeting
                socket.emit('message', formatMessage(botName, 'Welcome to StageSpace!'));

                //getting previous messages of the room
                const prevMessages = await mongMessage.find({ room: roomId }).populate('sender').select('sender content image timestamp').sort({ date: 'desc' });

                //send users and room info
                io.to(roomId).emit('roomData', {
                    room: receiver.username,
                    users: roomWithParticipants.participants,
                    messages: formatPreviousMessages(prevMessages)
                });

            } catch (error) {
                console.log(error);
            }
        });

        //listen for chat message
        socket.on('chatMessage', async (message) => {
            //creating message object
            const messageObj = formatMessage(sender.username, message);

            //saving message to the db
            const msg = new mongMessage({
                sender: sender._id,
                receiver: receiver._id,
                content: message,
                room: roomId
            });

            try {
                await msg.save();
            } catch (error) {
                console.log(error);
            }

            //sending object to frontend
            io.to(roomId).emit('message', messageObj);
        });

        //listen for file massage
        socket.on('fileMessage', async (img: string) => {
            const imageObj = formatImage(sender.username, img);

            //saving message with a photo to the db
            const imageMessage = new mongMessage({
                sender: sender._id,
                receiver: receiver._id,
                image: img,
                room: roomId
            });

            try {
                await imageMessage.save();
            } catch (error) {
                console.log(error);
            }

            //sending photo object to frontend
            io.to(roomId).emit('message-photo', imageObj);
        })

        //runs when client disconnects 
        socket.on('disconnect', () => {

        });
    });
}