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
        type: String
    },
    profilePicture: {
        type: String
    },
    token: String,
    login_attempts: {
        type: Number,
        default: 0
    }
}, { collection: 'users' });

export const mongUser = mongoose.model('User', UserSchema);