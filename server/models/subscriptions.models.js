import mongoose, { Schema, SchemaType } from 'mongoose';

const subscriptionSchema = new Schema({
    //person subscribing
    subscriber: {
        type: Schema.Types.ObjectId,
        ref: 'User'

    },
        //person who is the channel

    channel: {
        type: Schema.Types.ObjectId,
        ref: 'User'

    }



}, { timestamps: true });

export const Subscription = mongoose.model("Subscription", likesSchema);