import mongoose, { Schema, SchemaType } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

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
tweetSchema.plugin(aggregatePaginate);

export const Tweet = mongoose.model("Tweet", likesSchema);