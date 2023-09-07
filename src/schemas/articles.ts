import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema({
    username: {
        required: true,
        type: String
    },
    userId: {
        required: true,
        type: mongoose.Schema.Types.ObjectId
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

export const mongArticle = mongoose.model("articles", ArticleSchema);