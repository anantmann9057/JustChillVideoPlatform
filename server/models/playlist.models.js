import mongoose, { Schema, SchemaType } from 'mongoose';

const playlistSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'

    },
    videos: {
        type: Schema.Types.ObjectId,
        ref: 'Videos'

    },
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
    }
    ,
    views: {
        type: Number,
        default: 0,
    },
    duration: {
        type: Number,
        default: 0
    },
    isPrivate: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

export const PlayList = mongoose.model("Playlist", videosSchema);