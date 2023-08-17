import express from 'express';
import cors from 'cors';

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

//my-profile.component -> profile.service
//set profile picture and save to the db
app.post('/api/profile-pic', async (req, res) => {
    const image = req.body.image;
    const userId = req.user.id;
    const updateData = { profilePicture: image }; //create object for db update

    await mongUser.updateOne({ _id: userId }, { $set: updateData }).then(result => {
      res.status(200).json({status: "Profile picture updated", result});
    })
    .catch(error => {
      res.status(500).json({error});
    });
});







module.exports = app;