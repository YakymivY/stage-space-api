import mongoose from 'mongoose';

const User = require('./users');

const ActorSchema = new mongoose.Schema({
    //some specific fields for actor
}, { collection: 'actors' });

export const mongActor = User.discriminator('Actor', ActorSchema);