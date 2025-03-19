import mongoose, { Schema, SchemaType } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

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
likesSchema.plugin(aggregatePaginate);
export const Likes = mongoose.model("Likes", likesSchema);