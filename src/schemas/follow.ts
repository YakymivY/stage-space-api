import mongoose from 'mongoose';

const FollowSchema = new mongoose.Schema({
    follower: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true
    },
    following: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}, { collection: 'follow' }); 

const Follow = mongoose.model('Follow', FollowSchema);

module.exports = Follow;