import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
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
    },
    comment: {
        type: String,
        required: true
    }
}, { collection: 'comments' });

export const mongComment = mongoose.model('Comment', CommentSchema);