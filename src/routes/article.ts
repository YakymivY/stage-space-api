import express from 'express';
import cors from 'cors';

//DATABASE
const mongArticle = require('../schemas/articles');
//

//UTILS

//

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:4201' }));

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
  
  app.get("/api/articles", async (req, res) => {
    try {
        const articles = await mongArticle.find().sort({ date: 'desc' });
        res.status(200).json(articles);
    } catch {
        res.json("error");
    }
  });
  
  app.delete('/api/delete-article', async (req, res) => {
    try {
        const id = req.query.id;
        await mongArticle.findByIdAndDelete(id);
        const result =  await mongArticle.find().sort({ date: 'desc' });
        res.status(200).json({redirect: "/articles/all", articles: result});
    } catch {
        res.status(400).json("error");
    }
});

module.exports = app;