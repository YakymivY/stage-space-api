import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now()
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    }
}, { collection: 'messages' });