import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiErrorResponse } from "../utils/ApiErrorResponse.js";
import { Comment } from "../models/comment.models.js";
import mongoose from "mongoose";

// Helper function to extract and validate input
const extractInput = (req, keys) => {
  const input = {};
  keys.forEach((key) => {
    input[key] = req.body[key] || req.query[key] || req.params[key];
    if (!input[key])
      throw new ApiErrorResponse(400, `Missing or invalid ${key}`);
  });
  return input;
};

const getVideoComments = asyncHandler(async (req, res) => {
  const { video_id } = extractInput(req, ["video_id"]);
  const videoComments = await Comment.aggregate([
    {
      $match: {
        videos: new mongoose.Types.ObjectId(video_id),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $addFields: {
        owner: {
          $arrayElemAt: ["$owner", 0],
        },
      },
    },
  ]);

  if (!videoComments)
    throw new ApiErrorResponse(200, "No comments on this video");

  return res.status(200).json(new ApiResponse(200, videoComments, "Success"));
});

const addComment = asyncHandler(async (req, res) => {
  const { video_id, comment } = extractInput(req, ["video_id", "comment"]);

  const newComment = await Comment.create({
    videos: video_id,
    owner: req.user._id,
    content: comment,
  });

  if (!newComment) throw new ApiErrorResponse(400, "Failed to publish comment");

  return res.status(200).json(new ApiResponse(200, newComment, "Success"));
});

const updateComment = asyncHandler(async (req, res) => {
  const { comment_id, comment } = extractInput(req, ["comment_id", "comment"]);

  const updatedComment = await Comment.findByIdAndUpdate(
    comment_id,
    { $set: { content: comment } },
    { new: true }
  );

  if (!updatedComment)
    throw new ApiErrorResponse(400, "Failed to update comment");

  return res.status(200).json(new ApiResponse(200, updatedComment, "Success"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { comment_id } = extractInput(req, ["comment_id"]);

  const deletedComment = await Comment.findByIdAndDelete(comment_id);
  if (!deletedComment)
    throw new ApiErrorResponse(400, "Failed to delete comment");

  return res.status(200).json(new ApiResponse(200, {}, "Success"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
