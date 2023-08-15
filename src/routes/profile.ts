import express from 'express';
import cors from 'cors';

//DATABASE
const mongActor = require('../schemas/actors');
const mongDirector = require('../schemas/directors');
//

//UTILS

//

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:4201' }));


app.post('/api/profile-pic', async (req, res) => {
    const { userId, role, image } = req.body;
    const updateData = { profilePicture: image };

    if (role === "actor") {
        const theActor = await mongActor.updateOne({ _id: userId }, { $set: updateData }).then(result => {
            res.status(200).json({status: "Profile picture updated", result});
          })
          .catch(error => {
            res.status(502).json({status: "error", error});
          });
    } else {
        const theDirector = await mongDirector.updateOne({ _id: userId }, { $set: updateData }).then(result => {
            res.status(200).json({status: "Profile picture updated", result});
          })
          .catch(error => {
            res.status(502).json({status: "error", error});
          });
    }
});







module.exports = app;