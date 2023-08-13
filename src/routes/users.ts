import express from 'express';
import cors from 'cors';

//DATABASE
const mongActor = require('../schemas/actors');
const mongDirector = require('../schemas/directors');
//

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:4201' }));



app.get('/api/get-users', async (req, res) => {
    try {
        const actors = await mongActor.find();
        const directors = await mongDirector.find();

        res.status(200).json({actors, directors});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});







module.exports = app;