import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String
    },
    surname: {
        type: String
    },
    birthdate: {
        type: String
    },
    institution: {
        type: String
    },
    status: {
        type: String
    },
    phone: {
        type: String
    },
    proffesion: {
        type: String
    },
    works: {
        type: String
    }
}, { collection: 'profile' });

export const mongProfile = mongoose.model('Profile', ProfileSchema);