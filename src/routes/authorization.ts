import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

//DATABASE
import { mongUser } from '../schemas/users';
import { mongProfile } from '../schemas/profile';
//

//UTILS

//

const app = express();

app.use(express.json());

// app.post('/create-user', async (req, res) => {
//   const { name, surname, email, password } = req.body;
//   const username = name + ' ' + surname;
//   const hashedPassword = await bcrypt.hash(password, 10);

//   try {
//     const user = new mongUser({
//       email,
//       password: hashedPassword,
//       username
//     });
//     await user.save();

//     const userId = user._id;
//     const emailCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
//     const phoneCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

//     const code = new mongCode({
//       userId, 
//       emailCode,
//       phoneCode
//     });
//     await code.save();

//     res.status(200).json({status: "success", id: userId});
//   } catch(error) {
//     console.log(error);
//     res.status(500).json({error: "Internal Server Error"});
//   }
// });

//register.component -> auth.service
app.post('/register', async (req, res) => {
  try {
    const { email, password, name, surname, birthdate, institution, status, countryCode, phone, proffesion, works } = req.body.data;
    const username = name + ' ' + surname;
    const phoneNumber = countryCode + phone;
    const hashedPassword = await bcrypt.hash(password, 10);

    //save user's main info
    const user = new mongUser({
      email,
      password: hashedPassword,
      username
    });
    await user.save();

    const userId = user._id; //taking id of created user

    //save users additional info
    const profile = new mongProfile ({
      userId,
      name,
      surname,
      birthdate,
      institution, 
      status,
      phoneNumber,
      proffesion,
      works
    });
    await profile.save();

    res.status(200).json({status: "success"});
  } catch {
    res.status(500).json({error: "Internal Server Error"});
  }
});
  
//login.component -> auth.service
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const inUsers = await mongUser.findOne({email});
      
    if (!inUsers) { 
      //no user with the email
      res.json({status: "incorrect email"});
      return
    }

    const passwordCheck = await bcrypt.compare(password, inUsers.password); //password check
    if (!passwordCheck) { 
      //incorrect password detected
      const filter = { _id: inUsers._id};
      const update = { $inc: { login_attempts: 1 } };
      await mongUser.updateOne(filter, update);
      const obj = await mongUser.findOne(filter);
      res.json({status: "incorrect password", attempts: obj.login_attempts});
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

//register.component -> auth.service
//check if the email is already registered in db
app.get('/check-email', async (req, res) => {
  const email = req.query.email;
  try {
    const response = await mongUser.findOne({email});
    if (response) {
      res.status(200).json({exist: true});
    } else {
      res.status(200).json({exist: false});
    }
  } catch(error) {
    res.status(500).json({error: "Internal Server Error"});
  }
});

//register.component -> auth.service
//send email to a user with verification code
app.post('/send-email', (req, res) => {
  const { email, verification_code } = req.body;

  const mailOptions = {
    from: 'berk.keytret@gmail.com',
    to: email,
    subject: 'Sending Email using Node.js',
    text: `Here is your code: ${verification_code}`
  };

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'berk.keytret@gmail.com',
        pass: 'rywauddjwfysslzp'
      }
    });
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.status(200).json({status: "success"});
  } catch(error) {
    res.status(500).json({error: "Internal Server Error"});
  }

});

module.exports = app;