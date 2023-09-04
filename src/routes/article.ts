import express from 'express';

//DATABASE
import { mongArticle } from '../schemas/articles';
import { mongLike} from '../schemas/likes';
import { mongComment } from '../schemas/comments';
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
    const myUserId = req.user.id;
    try {
        const follows = await getFollowings(req.user.id);

        const articles = await mongArticle.aggregate([
            { $match: { userId: { $in: follows } } },
            {
                $lookup: {
                    from: 'likes',
                    localField: '_id',
                    foreignField: 'postId',
                    as: 'likes'
                }
            },
            {
                $addFields: {
                  likedUserIds: {
                    $map: {
                      input: '$likes',
                      as: 'like',
                      in: '$$like.userId'
                    }
                  }
                }
            },
            {
                $project: {
                    username: 1,
                    userId: 1,
                    title: 1,
                    description: 1,
                    date: 1,
                    image: 1,
                    likedUserIds: 1
                }
            },
            { $sort: { date: -1 } }
        ]);

        ///////////?????????????????????????????
        articles.forEach(article => {
            for (let i = 0; i < article.likedUserIds.length; i++) {
                if (article.likedUserIds[i].toString() == myUserId) {
                    article.isLiked = true;
                    continue;
                } else {
                    article.isLiked = false;
                }
            }
        });

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

//blog.component -> article.service
//like post
app.post('/api/like', async (req, res) => {
    const postId = req.body.articleId;
    const userId = req.user.id;

    const like = new mongLike({
        userId,
        postId
    });

    try {
        await like.save();
        res.status(200).json({status: "success"});
    } catch(error) {
        res.status(400).json({ error: "Internal Server Error" });
    }
});

//blog.component -> article.service
//dislike post
app.delete('/api/dislike', async (req, res) => {
    const postId = req.query.articleId;
    const userId = req.user.id;

    try {
        await mongLike.findOneAndDelete({ userId, postId });
        res.status(200).json({status: "success"});
    } catch(error) {
        res.status(400).json({ error: "Internal Server Error" });
    }
});

app.get('/api/get-like-users', async (req, res) => {
    const myUserId = req.user.id;
    const follows = await getFollowings(req.user.id);
    const postId = req.query.articleId;

    try {
        const likes = await mongLike.find({postId}).populate('userId', '_id username').select('userId');

        let likesArray = [];
        likes.forEach((element: any) => {
            const resLike = {
                userId: element.userId._id,
                username: element.userId.username
            }
            likesArray.push(resLike);
        });
        res.status(200).json({status: "success", likes: likesArray});
    } catch(error) {
        res.status(400).json({ error: "Internal Server Error" });
    }
});

//blog.component -> article.service
//posting comment into the db
app.post('/api/comment', async (req, res) => {
    const { articleId, comment } = req.body;
    const userId = req.user.id;

    const com = new mongComment({
        userId, 
        postId: articleId,
        comment
    });

    try {
        await com.save();

        //creating object to return to frontend
        const resComment = {
            comment: com.comment,
            userId: {
                _id: req.user.id,
                username: req.user.name
            }
        }
        
        res.status(200).json({status: "success", resComment});
    } catch(error) {
        res.status(400).json({ error: "Internal Server Error" });
    }
});

//blog.component -> article.service
//load comments for the post
app.get('/api/get-comments', async (req, res) => {
    const postId = req.query.articleId;

    try {
        //getting comments with userinfo
        const postComments = await mongComment.find({ postId }).populate({path: 'userId', select: 'username'}).select('comment userId');
        res.status(200).json({status: "success", comments: postComments});
    } catch (error) {
        res.status(400).json({ error: "Internal Server Error" });
    }
});

module.exports = app;