import mongoose from 'mongoose';

const DirectorSchema = new mongoose.Schema({
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
    profilePicture: {
        type: String
    },
    token: String,
}, { collection: 'directors' });

const Director = mongoose.model('Director', DirectorSchema);

module.exports = Director;