import mongoose, { Schema, SchemaType } from 'mongoose';

const likesSchema = new Schema({
    
    videos: {
        type: Schema.Types.ObjectId,
        ref: 'Videos'

    },
    comments: {
        type: Schema.Types.ObjectId,
        ref: 'Comments'

    },tweet: {
        type: Schema.Types.ObjectId,
        ref: 'Tweet'

    },
    likedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'

    },
  

}, { timestamps: true });

export const Likes = mongoose.model("Likes", likesSchema);