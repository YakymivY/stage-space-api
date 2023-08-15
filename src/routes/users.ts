import express from 'express';
import cors from 'cors';

//DATABASE
const mongActor = require('../schemas/actors');
const mongDirector = require('../schemas/directors');
const mongArticle = require('../schemas/articles');
//

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:4201' }));



app.get('/api/get-users', async (req, res) => {
    try {
        const actors = await mongActor.find({}, { _id: 1, email: 1, username: 1 });
        const directors = await mongDirector.find({}, { _id: 1, email: 1, username: 1 });

        res.status(200).json({actors, directors});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/get-user', async (req, res) => {
    const userId = req.query.id;
    try {
        let foundUser = await mongActor.findOne({_id: userId}, { _id: 1, email: 1, username: 1, profilePicture: 1 });
        if (foundUser === null) foundUser = await mongDirector.findOne({_id: userId}, { _id: 1, email: 1, username: 1 });
        res.status(200).json({ user: foundUser });
    } catch(error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/get-user-articles', async (req, res) => {
    const userId = req.query.id;
    try {
        const articles = await mongArticle.find({ userId });
        res.status(200).json({ status: "Articles found", articles });
    } catch(error) {
        //other code
        res.status(500).json({ error: 'Internal Server Error' });
    }
});







module.exports = app;