import mongoose from "mongoose";

const CodeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    emailCode: {
        type: Number,
        required: true
    },
    phoneCode: {
        type: Number,
        required: true
    }
}, { collection: 'codes' });

export const mongCode = mongoose.model("Code", CodeSchema);