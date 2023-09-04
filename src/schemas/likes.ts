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

export const mongLike = mongoose.model('Like', LikeSchema);