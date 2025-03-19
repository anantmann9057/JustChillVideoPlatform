import mongoose, { Schema, SchemaType } from 'mongoose';

const videosSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true

    },
    fullName: {
        type: String,
        trim: true,
        index: true
    }
    ,
    avatar: {
        type: String,
        required: true,
    },
    coverImage: {
        type: String,
    },
    watchHistory: [
        {
            type:Schema.Types.ObjectId,
            ref:"Videos"
        }
    ]
});

export const Videos = mongoose.model("Videos", videosSchema);