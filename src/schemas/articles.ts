import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema({
    username: {
        required: true,
        type: String
    },
    userId: {
        required: true,
        type: String
    },
    title: {
        required: true,
        type: String
    },
    description: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    image: {
        type: String
    }
});

const Article = mongoose.model("articles", ArticleSchema);

module.exports = Article;