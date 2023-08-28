import express from 'express';

//DATABASE
const mongArticle = require('../schemas/articles');
//

//UTILS
import { getFollowings } from '../utils/users';
//

const app = express();

app.use(express.json());

//new-article.component -> article.service
//create a new article in the db
app.post("/api/post-article", async (req, res) => {
    const { title, description, image, username, id } = req.body;
    const article = new mongArticle({
        username,
        title,
        description,
        image,
        userId: id
    });
    try {
        const result = await article.save();
        res.json({redirect: result.id});
    } catch(e) {
        res.status(500).json({error: e});
    }
  });

  //article.component -> article.service
  //get article based on id
  app.get("/api/get-article", async (req, res) => {
    const id = req.query.id;
    try {
        const article = await mongArticle.findOne({_id: id});
        if (article == null || undefined) res.json({ redirect: '/articles' });
        res.json(article);
    } catch {
        res.status(400).json({ error: 'Invalid article ID' })
    }
  });

  //blog.component -> article.service
  //get all articles
  app.get("/api/articles", async (req, res) => {
    try {
        const follows = await getFollowings(req.user.id);
        const articles = await mongArticle.find({ userId: { $in: follows } }).sort({ date: 'desc' });
        res.status(200).json(articles);
    } catch {
        res.json("error");
    }
  });
  
  //blog.component -> article.service
  //delete article based on id
  app.delete('/api/delete-article', async (req, res) => {
    const id = req.query.id;
    try {
        await mongArticle.findByIdAndDelete(id);
        await mongArticle.find().sort({ date: 'desc' });
        res.status(200).json({redirect: "/articles/all"});
    } catch {
        res.status(400).json({ error: "Internal Server Error" });
    }
});

module.exports = app;