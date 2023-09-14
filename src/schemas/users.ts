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
    verification_code: {
        type: Number
    },
    token: String,
}, { collection: 'users' });

export const mongUser = mongoose.model('User', UserSchema);