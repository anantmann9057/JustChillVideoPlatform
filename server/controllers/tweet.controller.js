import mongoose, { isValidObjectId } from "mongoose"

import { asyncHandler } from "../utils/asynchandler.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { ApiErrorResponse } from "../utils/ApiErrorResponse.js"
import { uploadFile } from "../utils/Cloudinary.js"
import { Tweet } from "../models/tweet.models.js"
const createTweet = asyncHandler(async (req, res) => {

    if (!req.body && !req.params && req.query) throw new ApiErrorResponse(400, 'please input some value');

    if (!req.body.content && !req.params.content && !req.query.content) throw new ApiErrorResponse(400, 'please input content');

    let newTweet = await Tweet.create({
        content: req.body.content || req.params.content || req.query.content,
        owner: new mongoose.Types.ObjectId(req.user._id)
    });

    if (!newTweet) throw new ApiErrorResponse(400, 'something went wrong creating tweet');

    return res.status(200).json(new ApiResponse(200, newTweet, 'Tweet posted Successfully'))

});

const getUserTweets = asyncHandler(async (req, res) => {


    let findTweet = await Tweet.find({
        owner:req.user._id
    });

    if (!findTweet) throw new ApiErrorResponse(400, 'something went wrong creating tweet');

    return res.status(200).json(new ApiResponse(200, findTweet, 'Tweet posted Successfully'))
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