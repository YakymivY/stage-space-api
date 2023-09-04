import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
    name: {
        type: String
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt: {
        type: Date,
        default: Date.now()
    }
}, { collection: 'rooms' });

export const mongRoom = mongoose.model('room', RoomSchema);