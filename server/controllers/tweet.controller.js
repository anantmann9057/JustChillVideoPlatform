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
        owner: req.user._id
    });

    if (!findTweet) throw new ApiErrorResponse(400, 'something went wrong creating tweet');

    return res.status(200).json(new ApiResponse(200, findTweet, 'Tweet posted Successfully'))
})

const updateTweet = asyncHandler(async (req, res) => {
    if (!req.body && !req.query && !req.params) throw new ApiErrorResponse(400, 'please input value');
    if (!req.body.content && !req.query.content && !req.params.content) throw new ApiErrorResponse(400, 'please input content');
    if (!req.body.tweetId && !req.query.tweetId && !req.params.tweetId) throw new ApiErrorResponse(400, 'please input id');

    let findTweet = await Tweet.findByIdAndUpdate(req.body.tweetId || req.query.tweetId || req.params.tweetId, {
        $set: {
            content: req.body.content || req.query.content || req.params.content
        }
    }, {
        new: true
    });

    if (!findTweet) throw new ApiErrorResponse(400, 'something went wrong');
    findTweet.save({ validateBeforeSave: false });


    return res.status(200).json(new ApiResponse(200, findTweet, 'tweet updated successfully'));

})
//fix updation issue
const deleteTweet = asyncHandler(async (req, res) => {
    if (!req.body && !req.query && !req.params) throw new ApiErrorResponse(400, 'please input value');
    if (!req.body.tweetId && !req.query.tweetId && !req.params.tweetId) throw new ApiErrorResponse(400, 'please input id');

    let findTweet = await Tweet.findByIdAndDelete(req.body.tweetId || req.query.tweetId || req.params.tweetId, {
    }, {
        new: true
    });

    if (!findTweet) throw new ApiErrorResponse(400, 'tweet not found');


    return res.status(200).json(new ApiResponse(200, findTweet, 'tweet deleted successfully'));
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}