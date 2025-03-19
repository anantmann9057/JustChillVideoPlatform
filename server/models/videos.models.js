import mongoose, { Schema, SchemaType } from 'mongoose';

const videosSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'

    },
    videoFile: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    thumbnail: {
        type: String,
        required: true,
    }
    ,
    title: {
        type: String,
        required: true,
    }
    , description: {
        type: String,
    }
    ,
    views: {
        type: Number,
        default: 0,
    },
    duration: {
        type: Number,
        required: true,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

export const Videos = mongoose.model("Videos", videosSchema);