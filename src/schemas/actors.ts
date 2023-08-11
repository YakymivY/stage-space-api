import mongoose from 'mongoose';

const ActorSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }, 
    password: {
        type: String,
        required: true
    },
    username: String,
    token: String,
}, { collection: 'actors' });

const Actor = mongoose.model('Actor', ActorSchema);

module.exports = Actor;