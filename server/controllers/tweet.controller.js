import mongoose from "mongoose";
import { ApiErrorResponse } from "../utils/ApiErrorResponse.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import extractInput from "../utils/Helper.js";
import { Tweet } from "../models/tweet.models.js";

// Create a new tweet
const createTweet = asyncHandler(async (req, res) => {
    const { content } = extractInput(req, ["content"]);

    const newTweet = await Tweet.create({
        content,
        owner: new mongoose.Types.ObjectId(req.user._id),
    });

    if (!newTweet) throw new ApiErrorResponse(400, "Something went wrong creating the tweet");

    return res.status(200).json(new ApiResponse(200, newTweet, "Tweet posted successfully"));
});

// Get tweets by the logged-in user
const getUserTweets = asyncHandler(async (req, res) => {
    const tweets = await Tweet.find({ owner: req.user._id });

    if (!tweets || tweets.length === 0) throw new ApiErrorResponse(400, "No tweets found");

    return res.status(200).json(new ApiResponse(200, tweets, "Tweets fetched successfully"));
});

// Update a tweet
const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId, content } = extractInput(req, ["tweetId", "content"]);

    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        { $set: { content } },
        { new: true }
    );

    if (!updatedTweet) throw new ApiErrorResponse(400, "Tweet not found or update failed");

    return res.status(200).json(new ApiResponse(200, updatedTweet, "Tweet updated successfully"));
});

// Delete a tweet
const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = extractInput(req, ["tweetId"]);

    const deletedTweet = await Tweet.findByIdAndDelete(tweetId);

    if (!deletedTweet) throw new ApiErrorResponse(400, "Tweet not found");

    return res.status(200).json(new ApiResponse(200, deletedTweet, "Tweet deleted successfully"));
});

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet,
};