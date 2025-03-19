import mongoose, { Schema, SchemaType } from 'mongoose';

const tweetSchema = new Schema({
    //person subscribing
    content: {
        type: String,
        required:true,

    },
        //person who is the channel

    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'

    }



}, { timestamps: true });

export const Tweet = mongoose.model("Tweet", likesSchema);