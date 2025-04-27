import mongoose, { SchemaTypes } from "mongoose";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import extractInput from "../utils/Helper.js";
import { uploadFile } from "../utils/Cloudinary.js";
import { Videos } from "../models/videos.models.js";
import { User } from "../models/users.models.js";
import { ApiErrorResponse } from "../utils/ApiErrorResponse.js";

// Helper function to validate required fields
const validateFields = (fields, data) => {
  fields.forEach((field) => {
    if (!data[field])
      throw new ApiErrorResponse(400, `Missing required field: ${field}`);
  });
};

// Get all videos
const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const videos = await Videos.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "user_details",
        pipeline: [{ $project: { userName: 1, avatar: 1, coverImage: 1 } }],
      },
    },
    {
      $unwind: {
        path: "$user_details",
      },
    },

    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "videos",
        as: "likes",
      },
    },
    {
      $addFields: {
        totalLikes: { $size: "$likes" },
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "videos",
        as: "comments",
      },
    },
    {
      $addFields: {
        commentsCount: { $size: "$comments" },
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
        owner: { $arrayElemAt: ["$owner", 0] }, // Pick the first element from array
      },
    },
    {
      $addFields: {
        isLiked: {
          $in: [new mongoose.Types.ObjectId(req.user._id), "$likes.likedBy"],
        },
      },
    },
    {
      $project: {
        videoFile: 1,
        user_details: 1,
        title: 1,
        description: 1,
        thumbnail: 1,
        totalLikes: 1,
        comments: 1,
        likes: 1,
        commentsCount: 1,
        owner: 1,
        owner_details: 1,
        isLiked: 1,
      },
    },
  ]);

  if (!videos || videos.length === 0)
    throw new ApiErrorResponse(400, "No videos found");
  return res.status(200).json(new ApiResponse(200, videos, "Success"));
});

// Publish a video
const publishAVideo = asyncHandler(async (req, res) => {
  console.log(req);
  if (!req.files?.video)
    throw new ApiErrorResponse(400, "Please upload a video file");

  const { title, description, thumbnail } = req.body;
  validateFields(["title", "description", "thumbnail"], req.body);

  const videoLink = await uploadFile(req.files.video[0].path);
  const thumbnailLink = await uploadFile(thumbnail);
  const video = await Videos.create({
    owner: req.user._id,
    videoFile: videoLink.url,
    thumbnail: thumbnailLink.url,
    title,
    description,
    duration: 0,
  });

  if (!video)
    throw new ApiErrorResponse(500, "Something went wrong uploading the video");
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video published successfully"));
});

// Get video by ID
const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = extractInput(req, ["videoId"]);

  const videos = await Videos.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(videoId) },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "user_details",
        pipeline: [{ $project: { userName: 1, avatar: 1, coverImage: 1 } }],
      },
    },
    {
      $project: {
        videoFile: 1,
        user_details: 1,
      },
    },
  ]);

  if (!videos || videos.length === 0)
    throw new ApiErrorResponse(400, "Video not found");
  return res.status(200).json(new ApiResponse(200, videos, "Success"));
});

// Update video details
const updateVideo = asyncHandler(async (req, res) => {
  if (!req.files.thumbnail)
    throw new ApiErrorResponse("Please select thumbnail");
  const { videoId, title, description } = extractInput(req, [
    "videoId",
    "title",
    "description",
  ]);
  const videoLink = await uploadFile(req.files.thumbnail[0].path);

  const updatedVideo = await Videos.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title: title,
        description: description,
        thumbnail: videoLink.url,
      },
    },
    { new: true }
  );

  if (!updatedVideo)
    throw new ApiErrorResponse(400, "Video not found or update failed");
  return res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, "Video updated successfully"));
});

// Delete a video
const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = extractInput(req, ["videoId"]);

  const deletedVideo = await Videos.findByIdAndDelete(videoId);
  if (!deletedVideo) throw new ApiErrorResponse(400, "Video not found");

  const videos = await Videos.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "user_details",
        pipeline: [{ $project: { userName: 1, avatar: 1, coverImage: 1 } }],
      },
    },
    {
      $project: {
        videoFile: 1,
        user_details: 1,
        title: 1,
        description: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Video deleted successfully"));
});

const getUserVideos = asyncHandler(async (req, res) => {
  let userVideos = await Videos.aggregate([
    {
      $match: {
        owner: req.user._id,
      },
    },
  ]);

  if (!userVideos)
    return res.status(200).json(new ApiResponse(200, null, "no Videos found!"));

  return res.status(200).json(new ApiResponse(200, userVideos, "success"));
});
// Toggle publish status
const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId, publishStatus } = extractInput(req, [
    "videoId",
    "publishStatus",
  ]);

  const updatedVideo = await Videos.findByIdAndUpdate(
    videoId,
    { $set: { isPublished: publishStatus } },
    { new: true }
  );

  if (!updatedVideo)
    throw new ApiErrorResponse(400, "Video not found or update failed");
  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedVideo, "Publish status updated successfully")
    );
});

const addtoWatchHistory = asyncHandler(async (req, res) => {
  const videoId = extractInput(req, ["videoId"]);
  var userId = new mongoose.Types.ObjectId(req.user._id);
  var id = new mongoose.Types.ObjectId(videoId.videoId);

  const updateWatchHistory = await User.findByIdAndUpdate(
    userId,
    {
      $push: {
        watchHistory: {
          _id: id,
        },
      },
    },
    { new: true }
  );
  if (!updateWatchHistory)
    throw new ApiErrorResponse(408, "something went wrong");

  return res
    .status(200)
    .json(new ApiResponse(200, updateWatchHistory, "success"));
});

const testUpload = asyncHandler(async (req, res) => {
  console.log(req.body);
  const something = extractInput(req, ["thumbnail"]);

  if (!something) throw new ApiErrorResponse(407, "File not found");
  const base64Image = await uploadFile(something);

  if (!base64Image.url) throw new ApiErrorResponse(407, "something went wrong");
  return res
    .status(200)
    .json(new ApiResponse(200, base64Image, "file uploaded successfully"));
});
export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
  addtoWatchHistory,
  testUpload,
  getUserVideos,
};
