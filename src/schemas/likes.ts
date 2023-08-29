import mongoose from "mongoose";

const LikeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
        required: true,
        index: true
    }
}, { collection: 'likes' });

const Like = mongoose.model('Like', LikeSchema);

module.exports = Like;