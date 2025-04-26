import mongoose, { Schema, SchemaType } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

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
subscriptionSchema.plugin(aggregatePaginate);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);