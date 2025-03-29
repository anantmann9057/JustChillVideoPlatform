import mongoose, { isValidObjectId } from "mongoose"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Likes } from "../models/likes.models.js"
import { ApiErrorResponse } from "../utils/ApiErrorResponse.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    if (!req.body && !req.query && !req.params) throw new ApiErrorResponse(400, 'please input value');

    if (!req.body.video_id && !req.query.video_id && !req.params.video_id) throw new ApiErrorResponse(400, 'invalid video id!');

    if (!req.body.type && !req.query.type && !req.params.type) throw new ApiErrorResponse(400, 'invalid type');

    if (req.body.type == 1 || req.query.type == 1 || req.params.type == 1) {
        let findVideo = await Likes.findOne({
            videos: req.body.video_id || req.query.video_id || req.params.video_id,
        });

        if (!findVideo) {
            let video = await Likes.create({
                videos: req.body.video_id || req.query.video_id || req.params.video_id,
                likedBy: req.user._id
            },);
            return res.status(200).json(new ApiResponse(200, video, 'success'));
        }
        else {
            return res.status(200).json(new ApiResponse(200, findVideo, 'You already liked that video'));
        }
    }

    else if (req.body.type == 0 || req.query.type == 0 || req.params.type == 0) {
        let video = await Likes.findOneAndDelete({
            videos: req.body.video_id || req.query.video_id || req.params.video_id,
        });
        if (!video) throw new ApiErrorResponse(400, "video not found");
        return res.status(200).json(new ApiResponse(200, video, 'success'));
    }

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    if (!req.body && !req.query && !req.params) throw new ApiErrorResponse(400, 'please input value');

    if (!req.body.comment_id && !req.query.comment_id && !req.params.comment_id) throw new ApiErrorResponse(400, 'invalid comment id!');

    if (!req.body.type && !req.query.type && !req.params.type) throw new ApiErrorResponse(400, 'invalid type');

    if (req.body.type == 1 || req.query.type == 1 || req.params.type == 1) {
        let findComment = await Likes.findOne({
            comments: req.body.comment_id || req.query.comment_id || req.params.comment_id,
        });

        if (!findComment) {
            let comment = await Likes.create({
                comments: req.body.comment_id || req.query.comment_id || req.params.comment_id,
                likedBy: req.user._id
            },);
            return res.status(200).json(new ApiResponse(200, comment, 'success'));
        }
        else {
            return res.status(200).json(new ApiResponse(200, findComment, 'You already liked that comment'));
        }
    }

    else if (req.body.type == 0 || req.query.type == 0 || req.params.type == 0) {
        let comment = await Likes.findOneAndDelete({
            comments: req.body.comment_id || req.query.comment_id || req.params.comment_id,
        });

        if (!comment) throw new ApiErrorResponse(400, "comment not found");
        return res.status(200).json(new ApiResponse(200, comment, 'success'));
    }

})

const toggleTweetLike = asyncHandler(async (req, res) => {

    if (!req.body && !req.query && !req.params) throw new ApiErrorResponse(400, 'please input value');

    if (!req.body.tweet_id && !req.query.tweet_id && !req.params.tweet_id) throw new ApiErrorResponse(400, 'invalid tweet id!');

    if (!req.body.type && !req.query.type && !req.params.type) throw new ApiErrorResponse(400, 'invalid type');

    if (req.body.type == 1 || req.query.type == 1 || req.params.type == 1) {
        let findTweet = await Likes.findOne({
            tweet: req.body.tweet_id || req.query.tweet_id || req.params.tweet_id,
        });

        if (!findTweet) {
            let tweet = await Likes.create({
                tweet: req.body.tweet_id || req.query.tweet_id || req.params.tweet_id,
                likedBy: req.user._id
            },);
            return res.status(200).json(new ApiResponse(200, tweet, 'success'));
        }
        else {
            return res.status(200).json(new ApiResponse(200, findTweet, 'You already liked that tweet'));
        }




    }

    else if (req.body.type == 0 || req.query.type == 0 || req.params.type == 0) {
        let tweet = await Likes.findOneAndDelete({
            tweet: req.body.tweet_id || req.query.tweet_id || req.params.tweet_id,
        });

        if (!tweet) throw new ApiErrorResponse(400, "tweet not found");
        return res.status(200).json(new ApiResponse(200, tweet, 'success'));
    }

    // let tweet = await Likes.find({ tweet }).aggregate([
    //     {
    //         $match: {
    //             likedBy: req.user._id
    //         }
    //     },
    //     {
    //         $lookup: {
    //             from: "tweets",
    //             localField: "tweet",
    //             foreignField: "_id",
    //             as: "tweets",
    //         }
    //     }

    // ]);

}



)

const getLikedVideos = asyncHandler(async (req, res) => {
    let likedVideos = await Likes.aggregate([
        {
            $match: {
                likedBy: req.user._id,
                isLiked: true
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "owner",
                as: "videos",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "likes"
                            , pipeline: [
                                {
                                    $project: {

                                        userName: 1,
                                        avatar: 1, coverImage: 1, email: 1
                                    }
                                }
                            ]
                        },

                    },

                    {
                        $project: {
                            likes: 1,
                            videoFile: 1,
                            userName: 1
                        }
                    }


                ]
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
                            as: "likes"
                            , pipeline: [
                                {
                                    $project: {

                                        userName: 1,
                                        avatar: 1, coverImage: 1, email: 1
                                    }
                                }
                            ]
                        },

                    },

                    {
                        $project: {
                            likes: 1,
                            videoFile: 1,
                            userName: 1
                        }
                    }


                ]
            },

        },

    ]);

    if (!likedVideos) throw new ApiErrorResponse(400, 'no videos found');
    return res.status(200).json(new ApiResponse(200, likedVideos, 'videos fetched successfully'));
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}



