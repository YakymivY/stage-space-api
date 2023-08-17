import mongoose from 'mongoose';

const User = require('./users');

const ActorSchema = new mongoose.Schema({
    //some specific fields for actor
}, { collection: 'actors' });

const Actor = User.discriminator('Actor', ActorSchema);

module.exports = Actor;