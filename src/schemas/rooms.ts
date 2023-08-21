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

const Room = mongoose.model('room', RoomSchema);

module.exports = Room;