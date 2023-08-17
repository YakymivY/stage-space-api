import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
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
    role: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String
    },
    token: String,
}, { collection: 'users' });

const User = mongoose.model('User', UserSchema);

module.exports = User;