import mongoose from 'mongoose';

const User = require('./users');

const DirectorSchema = new mongoose.Schema({
    //some specific fields for director
}, { collection: 'directors' });

export const mongDirector = User.discriminator('Director', DirectorSchema);