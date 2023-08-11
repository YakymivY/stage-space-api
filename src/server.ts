import express from 'express';
import http from 'http';
//const socketio = require('socket.io');
//const mongoose = require('mongoose');
//const bcrypt = require('bcrypt');
//const jwt = require('jsonwebtoken');
import cors from 'cors';


if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

//DATABASE
// mongoose.Promise = Promise;
// mongoose.connect('mongodb://localhost:27017/stagespace', {
//   useNewUrlParser: true, useUnifiedTopology: true
// });

// const mongActor = require('./schemas/actors');
// const mongDirector = require('./schemas/directors');
// const mongArticle = require('./schemas/articles');
//

//CONFIG
import { connectDB } from './config/db';
//

//ROUTES
//const chatRoute = require('./routes/chat');
import {chatSocket} from './routes/chat';
const articleRoute = require('./routes/article');
const authRoute = require('./routes/authorization');
//

//UTILS
//const formatMsg = require('./utils/messages');
//import { userJoin, getCurrentUser, userLeave, getRoomUsers } from './utils/users';
import { authenticateToken } from './utils/auth';
//

const app = express();
const server = http.createServer(app);
// const io = socketio(server, {
//     cors: {
//       origin: 'http://localhost:4201',
//       methods: ['GET', 'POST'],
//     },
//   });

app.use(express.json());
app.use(cors({ origin: 'http://localhost:4201' }));
connectDB();
app.use('/api', authenticateToken);
chatSocket(server);
app.use(articleRoute);
app.use(authRoute);

//const botName = 'StageSpace bot';


// app.post('/api/register-actor', async (req, res) => {
//   try {
//     const email = req.body.email;
//     const password = req.body.password;
//     const name = req.body.name;

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const response = await mongActor.findOne({email});
//     if(response) {
//       res.json({status: "incorrect"});
//     } else {
//       const actor = new mongActor ({
//         email,
//         password: hashedPassword,
//         username: name,
//         token: "token"
//       });
//       await actor.save();

//       res.json({status: "success"});
//     }
//   } catch {
//     res.json('error');
//   }
// })

// app.post('/api/register-director', async (req, res) => {
//   try {
//     const email = req.body.email;
//     const password = req.body.password;
//     const name = req.body.name;

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const response = await mongDirector.findOne({email});
//     if(response) {
//       res.json({status: "incorrect"});
//     } else {
//       const director = new mongDirector ({
//         email,
//         password: hashedPassword,
//         username: name,
//         token: "token"
//       });
//       const result = await director.save();

//       res.json({status: "success"});
//     }
//   } catch {
//     res.json('error');
//   }
// })

// app.post('/api/login', async (req, res) => {
//   try {
//     const email = req.body.email;
//     const password = req.body.password;

//     const inActors = await mongActor.findOne({email});
//     const inDirectors = await mongDirector.findOne({email});

//     let user, role;
//     if (!inActors && !inDirectors) {
//       res.json({status: "incorrect"});
//       return
//     } else {
//       if (inActors) {
//         user = inActors;
//         role = "actor";
//       } else {
//         user = inDirectors;
//         role = "director";
//       }
//     }

//     const passwordCheck = await bcrypt.compare(password, user.password);
//     if (!passwordCheck) {
//       res.json({status: "incorrect"});
//     } else {
//       const email = user.email;
//       const username = user.username;
//       const userId = user._id;

//       const tokenUser = {
//         email,
//         name: username,
//         id: userId,
//         role
//       };
//       const accessToken = jwt.sign(tokenUser, process.env.ACCESS_TOKEN_SECRET);
//       user.token = accessToken;
//       res.status(200).json({status: "success", token: accessToken});
//     }
//   } catch {
//     res.json('error');
//   }
// });

// app.get('/api/get-name', (req, res) => {
//   res.json(req.user.name);
// });

// function authenticateToken (req, res, next) {
//   //take token
//   const authHeader = req.headers.authorization;
//   const token = authHeader && authHeader.split(' ')[1];

//   //verify user by token
//   if (token == null) return res.sendStatus(401);
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//       if (err) return res.sendStatus(403);
//       req.user = user;
//       console.log("Authenticated as", user.name); //////////////////////////
//       next();
//   });
// }


//ARTICLES
//ARTICLES
//ARTICLES

// app.post("/api/post-article", authenticateToken, async (req, res) => {
//   const { title, description, image } = req.body;
//   const article = new mongArticle({
//     title,
//     description,
//     image
//   });
//   try {
//     const result = await article.save();
//     res.json({redirect: result.id});
//   } catch(e) {
//     res.status(500).json({error: e});
//   }
// });

// app.get("/api/get-article", authenticateToken, async (req, res) => {
//   const id = req.query.id;
//   try {
//     const article = await mongArticle.findOne({_id: id});
//     if (article == null || undefined) res.json({ redirect: '/articles' });
//     res.json(article);
//   } catch {
//     res.status(400).json({ error: 'Invalid article ID' })
//   }
// });

// app.get("/api/articles", async (req, res) => {
//   try {
//     const articles = await mongArticle.find().sort({ date: 'desc' });
//     res.status(200).json(articles);
//   } catch {
//     res.json("error");
//   }
// });

// app.delete('/api/delete-article', async (req, res) => {
//   try {
//     const id = req.query.id;
//     await mongArticle.findByIdAndDelete(id);
//     const result =  await mongArticle.find().sort({ date: 'desc' });
//     res.status(200).json({redirect: "/articles", articles: result});
//   } catch {
//     res.status(400).json("error");
//   }
// });






// //CHAT STUFF
// //CHAT STUFF
// //CHAT STUFF
// //CHAT STUFF
// //CHAT STUFF

// //run when client connects
// io.on('connection', socket => {
//   //user joining the room
//   socket.on('joinRoom', ({ username, room }) => {

//     const user = userJoin(socket.id, username, room);

//     socket.join(user.room);

//     socket.emit('message', formatMsg(botName, 'Welcome to StageSpace!'));
//     //broadcast when a user connects 
//     socket.broadcast.to(user.room).emit('message', formatMsg(botName, `${user.username} has joined the chat!`));

//     //send users and room info
//     io.to(user.room).emit('roomUsers', {
//       room: user.room,
//       users: getRoomUsers(user.room)
//     }); 
//   });

//   //listen for chat message
//   socket.on('chatMessage', (message) => {
//     const user = getCurrentUser(socket.id);
//     io.to(user.room).emit('message', formatMsg(user.username, message));
//   });

//   //listen for file massage
//   socket.on('fileMessage', (obj) => {
//     const user = getCurrentUser(socket.id);
//     io.to(user.room).emit('message-photo', {message: formatMsg(user.username, obj.fileName), photo: obj});
//   })

//   //runs when client disconnects 
//   socket.on('disconnect', () => {
//     const user = userLeave(socket.id);
//     if (user) {
//       io.to(user.room).emit('message', formatMsg(botName, `${user.username} has left the chat.`));
//     }
//     //send users and room info
//     io.to(user.room).emit('roomUsers', {
//       room: user.room,
//       users: getRoomUsers(user.room)
//     }); 
//   });
// });






server.listen(3001);