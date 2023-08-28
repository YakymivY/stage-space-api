import express from 'express';

//DATABASE
const mongUser = require('../schemas/users');
const mongActor = require('../schemas/actors');
const mongDirector = require('../schemas/directors');
const mongArticle = require('../schemas/articles');
const mongFollow = require('../schemas/follow');
//

const app = express();

app.use(express.json());


//start.component -> start.service
//get all users from the db
app.get('/api/get-users', async (req, res) => {
    try {
        //returns list of users
        const users = await mongUser.find({ _id: { $ne: req.user.id }}, { _id: 1, email: 1, username: 1, role: 1 });

        //returns list of follows
        const myId = req.user.id;
        const myFollows = await mongFollow.find({ follower: myId }, { following: 1 });

        res.status(200).json({users, myFollows});
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//profile.component -> start.service
//get user for profile page
app.get('/api/get-user', async (req, res) => {
    const userId = req.query.id;
    try {
        const foundUser = await mongUser.findOne({ _id: userId }, { _id: 1, email: 1, username: 1, role: 1, profilePicture: 1 })
        res.status(200).json({ user: foundUser });
    } catch(error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//profile.component, my-profile.component -> start.service
//get articles for user's profile
app.get('/api/get-user-articles', async (req, res) => {
    let userId = req.query.id;
    if (userId == 'no id') userId = req.user.id;
    try {
        const articles = await mongArticle.find({ userId });
        res.status(200).json({ status: "Articles found", articles });
    } catch(error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//start.component -> start.service
//create follow document in the db
app.post('/api/follow-user', async (req, res) => {
    const followerId = req.user.id;
    const followingId = req.body.followingId;
    try {
        const follow = new mongFollow({
            follower: followerId,
            following: followingId
        });
        await follow.save();
        res.status(200).json({ status: "Follow signed" });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//start.component -> start.service
//delete follow document in the db
app.delete('/api/unfollow-user', async (req, res) => {
    const followerId = req.user.id;
    const followingId = req.query.id;
    try {
        await mongFollow.deleteOne({ follower: followerId, following: followingId });
        res.status(200).json({ status: "User unfollowed" });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




module.exports = app;