import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import jwt from 'jsonwebtoken';

if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

//DATABASE
const mongActor = require('../schemas/actors');
const mongDirector = require('../schemas/directors');
//

//UTILS

//

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:4201' }));

app.post('/register-actor', async (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;
      const name = req.body.name;
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const response = await mongActor.findOne({email});
      if(response) {
        res.json({status: "incorrect"});
      } else {
        const actor = new mongActor ({
          email,
          password: hashedPassword,
          username: name,
          token: "token"
        });
        await actor.save();
  
        res.json({status: "success"});
      }
    } catch {
      res.json('error');
    }
  })
  
  app.post('/register-director', async (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;
      const name = req.body.name;
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const response = await mongDirector.findOne({email});
      if(response) {
        res.json({status: "incorrect"});
      } else {
        const director = new mongDirector ({
          email,
          password: hashedPassword,
          username: name,
          token: "token"
        });
        const result = await director.save();
  
        res.json({status: "success"});
      }
    } catch {
      res.json('error');
    }
  })
  
  app.post('/login', async (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;
  
      const inActors = await mongActor.findOne({email});
      const inDirectors = await mongDirector.findOne({email});
        
      let user, role;
      if (!inActors && !inDirectors) {
        res.json({status: "incorrect"});
        return
      } else {
        if (inActors) {
          user = inActors;
          role = "actor";
        } else {
          user = inDirectors;
          role = "director";
        }
    }
  
      const passwordCheck = await bcrypt.compare(password, user.password);
      if (!passwordCheck) {
        res.json({status: "incorrect"});
      } else {
        const email = user.email;
        const username = user.username;
        const userId = user._id;
  
        const tokenUser = {
          email,
          name: username,
          id: userId,
          role
        };
        const accessToken = jwt.sign(tokenUser, process.env.ACCESS_TOKEN_SECRET);
        user.token = accessToken;
        res.status(200).json({status: "success", token: accessToken});
      }
    } catch {
      res.json('error');
    }
  });
  
  app.get('/api/get-token-user', (req, res) => {
    const username = req.user.name;
    const id = req.user.id;
    const email = req.user.email;
    const role = req.user.role;
    res.json({username, id, email, role});
  });

  app.get('/api/get-profile-picture', async (req, res) => {
    const userId = req.user.id;
    let userImage;
    try {
      if(req.user.role === "actor") {
        userImage = await mongActor.findOne({_id: userId}).select('profilePicture');
      } else {
        userImage = await mongDirector.findOne({_id: userId}).select('profilePicture');
      }
      res.status(200).json({status: "Picture found", image: userImage});
    } catch (error) {
      res.status(502).json({status: "error"});
    }
  });

module.exports = app;