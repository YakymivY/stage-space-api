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

export const Comment = mongoose.model('Comment', CommentSchema);

//module.exports = Comment;