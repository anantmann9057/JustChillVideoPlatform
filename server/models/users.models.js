import mongoose, { Schema, SchemaType } from 'mongoose';

const userScheme = new Schema({
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
            type: Schema.Types.ObjectId,
            ref: "Videos"
        }
    ],
    password: {
        type: String, required: [true, 'password is required']
    },
    refreshToken: {
        type: String
    }
},{timestamps:true});

export const User = mongoose.model("User", userScheme);