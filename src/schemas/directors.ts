import mongoose from 'mongoose';

const User = require('./users');

const DirectorSchema = new mongoose.Schema({
    //some specific fields for director
}, { collection: 'directors' });

const Director = User.discriminator('Director', DirectorSchema);

module.exports = Director;