import mongoose, { isValidObjectId } from "mongoose"

import { asyncHandler } from "../utils/asynchandler.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { ApiErrorResponse } from "../utils/ApiErrorResponse.js"
import { uploadFile } from "../utils/Cloudinary.js"
import { Tweet } from "../models/tweet.models.js"
const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}