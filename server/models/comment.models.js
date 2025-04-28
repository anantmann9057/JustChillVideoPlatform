import mongoose, { Schema, SchemaType } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new Schema(
  {
    videos: {
      type: Schema.Types.ObjectId,
      ref: "Videos",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

commentSchema.plugin(aggregatePaginate);

export const Comment = mongoose.model("Comment", commentSchema);
