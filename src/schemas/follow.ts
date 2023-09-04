import mongoose from 'mongoose';

const FollowSchema = new mongoose.Schema({
    follower: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: 'User'
    },
    following: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, { collection: 'follow' }); 

export const mongFollow = mongoose.model('Follow', FollowSchema);