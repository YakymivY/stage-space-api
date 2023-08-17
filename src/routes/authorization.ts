import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import jwt from 'jsonwebtoken';

if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

//DATABASE
const mongUser = require('../schemas/users');
// const mongActor = require('../schemas/actors');
// const mongDirector = require('../schemas/directors');
//

//UTILS

//

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:4201' }));

//register.component -> auth.service
app.post('/register', async (req, res) => {
    try {
      const { email, password, name, role } = req.body;
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const response = await mongUser.findOne({email});
      if(response) {
        res.json({status: "incorrect"});
      } else {
        const user = new mongUser ({
          email,
          password: hashedPassword,
          username: name,
          role,
          token: "token"
        });
        await user.save();
  
        res.status(200).json({status: "success"});
      }
    } catch {
      res.status(500).json({error: "Internal Server Error"});
    }
  })
  
  //login.component -> auth.service
  app.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const inUsers = await mongUser.findOne({email});
        
      if (!inUsers) { 
        //no user with the email
        res.status(400).json({status: "incorrect"});
        return
      }
  
      const passwordCheck = await bcrypt.compare(password, inUsers.password); //password check
      if (!passwordCheck) { 
        //incorrect password detected
        res.status(400).json({status: "incorrect"});
      } else {
        const email = inUsers.email;
        const username = inUsers.username;
        const userId = inUsers._id;
        const role = inUsers.role;
  
        //creating jwt schema
        const tokenUser = {
          email,
          name: username,
          id: userId,
          role
        };
        const accessToken = jwt.sign(tokenUser, process.env.ACCESS_TOKEN_SECRET); //creating jwt
        await mongUser.updateOne({ _id: userId }, {$set: { token: accessToken }}); //updating accessToken in the db
        res.status(200).json({status: "success", token: accessToken});
      }
    } catch {
      res.status(500).json({error: "Internal Server Error"});
    }
  });
  
  //header.component, new-article.component, my-profile.component -> auth.service
  //send info from token to client
  app.get('/api/get-token-user', (req, res) => {
    const username = req.user.name;
    const id = req.user.id;
    const email = req.user.email;
    const role = req.user.role;
    res.json({username, id, email, role});
  });

  //my-profile.component -> auth.service
  //send profile picture to client
  app.get('/api/get-profile-picture', async (req, res) => {
    const userId = req.user.id;
    try {
      const userImage = await mongUser.findOne({_id: userId}).select('profilePicture');
      res.status(200).json({status: "Picture found", image: userImage});
    } catch (error) {
      res.status(500).json({error: "Internal Server Error"});
    }
  });

module.exports = app;