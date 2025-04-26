import mongoose from "mongoose";
import { Notifications } from "../models/notifications.models.js";
import { Videos } from "../models/videos.models.js";
import { ApiErrorResponse } from "../utils/ApiErrorResponse.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import extractInput from "../utils/Helper.js";

const sendLikeNotification = asyncHandler(async (req, res) => {
  const { video_id, type } = extractInput(req, ["video_id", "type"]);

  if (!video_id) throw new ApiErrorResponse(410, "video not found");

  const { owner } = await Videos.findById(video_id);

  if (!owner) throw new ApiErrorResponse(500, "user not found");

  if (type == "like") {
    let insertNotification = await Notifications.create({
      sender: new mongoose.Types.ObjectId(req.user._id),
      recipient: new mongoose.Types.ObjectId(owner),
      type: "like",
    });

    if (!insertNotification)
      throw new ApiErrorResponse(500, "Something went wrong");
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          insertNotification,
          "Notification Sent successfully"
        )
      );
  } else if (type == "comment") {
    let insertNotification = await Notifications.create({
      sender: new mongoose.Types.ObjectId(req.user._id),
      recipient: new mongoose.Types.ObjectId(owner),
      type: "comment",
    });

    if (!insertNotification)
      throw new ApiErrorResponse(500, "Something went wrong");
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          insertNotification,
          "Notification Sent successfully"
        )
      );
  } else if (type == "video") {
    let insertNotification = await Notifications.create({
      sender: new mongoose.Types.ObjectId(req.user._id),
      recipient: new mongoose.Types.ObjectId(owner),
      type: "like",
    });

    if (!insertNotification)
      throw new ApiErrorResponse(500, "Something went wrong");
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          insertNotification,
          "Notification Sent successfully"
        )
      );
  }
});
const getNotifications = asyncHandler(async (req, res) => {
  let getReceipent = await Notifications.aggregate([
    {
      $match: {
        recipient: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "sender",
        foreignField: "_id",
        as: "users",
      },
    },
    {
      $addFields: {
        users: {
          $arrayElemAt: ["$users", 0],
        },
      },
    },
  ]);
  if (!getReceipent) throw new ApiErrorResponse(500, "User not found");

  console.log(getReceipent);
  return res.status(200).json(new ApiResponse(200, getReceipent, "Success"));
});
export { sendLikeNotification, getNotifications };
