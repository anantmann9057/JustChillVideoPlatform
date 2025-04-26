import mongoose, { mongo } from "mongoose";
import { Likes } from "../models/likes.models.js";
import { ApiErrorResponse } from "../utils/ApiErrorResponse.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import extractInput from "../utils/Helper.js";
import videosRouter from "../routes/videos.route.js";
// Generic toggle like function
const unlikeVideo = asyncHandler(async (req, res) => {
  const { video_id } = extractInput(req, ["video_id"]);
  const likedVideo = await Likes.findOne({
    videos: new mongoose.Types.ObjectId(video_id),
  });
  if (!likedVideo) throw new ApiErrorResponse(409, "video already unliked");

  const newLikedVideo = await Likes.deleteOne({
    videos: new mongoose.Types.ObjectId(video_id),
    likedBy: new mongoose.Types.ObjectId(req.user._id),
  });
  return res.status(200).json(new ApiResponse(200, newLikedVideo));
});

// Toggle video like
const toggleVideoLike = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { video_id } = extractInput(req, ["video_id"]);

  const likedVideo = await Likes.findOne({
    videos: new mongoose.Types.ObjectId(video_id),
  });

  if (likedVideo) throw new ApiErrorResponse(409, "Video Already Liked!");

  const newLikedVideo = await Likes.create({
    videos: new mongoose.Types.ObjectId(video_id),
    likedBy: new mongoose.Types.ObjectId(req.user._id),
  });

  return res.status(200).json(new ApiResponse(200, newLikedVideo));
});


// Get liked videos
const getLikedVideos = asyncHandler(async (req, res) => {
  const likedVideos = await Likes.aggregate([
    {
      $match: {
        likedBy: req.user._id,
        isLiked: true,
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "videos",
        foreignField: "_id",
        as: "videos",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "likes",
              pipeline: [
                {
                  $project: {
                    userName: 1,
                    avatar: 1,
                    coverImage: 1,
                    email: 1,
                  },
                },
              ],
            },
          },
          {
            $project: {
              likes: 1,
              videoFile: 1,
              userName: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "tweets",
        localField: "tweet",
        foreignField: "_id",
        as: "tweets",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "likes",
              pipeline: [
                {
                  $project: {
                    userName: 1,
                    avatar: 1,
                    coverImage: 1,
                    email: 1,
                  },
                },
              ],
            },
          },
          {
            $project: {
              likes: 1,
              videoFile: 1,
              userName: 1,
            },
          },
        ],
      },
    },
  ]);

  if (!likedVideos) throw new ApiErrorResponse(400, "No videos found");
  return res
    .status(200)
    .json(new ApiResponse(200, likedVideos, "Videos fetched successfully"));
});

const getVideoLikedStatus = asyncHandler(async (req, res) => {
  const { video_id } = extractInput(req, ["video_id"]);
  let likedVideos = await Likes.aggregate([
    {
      $match: {
        videos: new mongoose.Types.ObjectId(video_id),
        likedBy: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $addFields: {
        totalLike: { $count: "" },
      },
    },
  ]);

  if (!likedVideos)
    return res.status(200).json(new ApiResponse(200, { is_liked: false }));
  else
    return res.status(200).json(
      new ApiResponse(200, {
        is_liked: true,
      })
    );
});

const getTotalLikesOnVideos = asyncHandler(async (req, res) => {
  const { video_id } = extractInput(req, ["video_id"]);
  let likedVideos = await Likes.aggregate([
    {
      $match: {
        videos: new mongoose.Types.ObjectId(video_id),
      },
    },
    {
      $count: "totalLikes",
    },
  ]);

  if (!likedVideos) return res.status(200).json(new ApiResponse(200, {}));
  else return res.status(200).json(new ApiResponse(200, likedVideos[0]));
});
export {
 
  toggleVideoLike,
  getLikedVideos,
  getVideoLikedStatus,
  getTotalLikesOnVideos,
  unlikeVideo,
};
