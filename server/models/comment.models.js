import mongoose, { Schema, SchemaType } from 'mongoose';

const commentSchema = new Schema({

    videos: {
        type: Schema.Types.ObjectId,
        ref: 'Videos'

    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'

    }, content: {
        type: String,
        required: true

    },



}, { timestamps: true });

export const Comment = mongoose.model("Comment", likesSchema);