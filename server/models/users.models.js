import mongoose, { Schema, SchemaType } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

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
}, { timestamps: true });
userScheme.plugin(aggregatePaginate);

export const User = mongoose.model("User", userScheme);