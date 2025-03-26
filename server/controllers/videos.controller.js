import mongoose, { isValidObjectId } from "mongoose"

import { asyncHandler } from "../utils/asynchandler.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { ApiErrorResponse } from "../utils/ApiErrorResponse.js"
import { uploadFile } from "../utils/Cloudinary.js"
import { Videos } from "../models/videos.models.js"

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    let videos = await Videos.aggregate([
        {
            $match: {
                //    owner: req.user._id
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "user_details",
                pipeline: [
                    {
                        $project: {
                            userName: 1, avatar: 1, coverImage: 1
                        }
                    }
                ]
            },
        }, {
            $project: {
                videoFile: 1, user_details: 1, title: 1, description: 1
            }
        }
    ])

    if (!videos) throw new ApiErrorResponse(400, 'videos not found');
    return res.status(200).json(new ApiResponse(200, videos, 'Success'));
})

const publishAVideo = asyncHandler(async (req, res) => {
    if (!req.files || !req.files.video) throw new ApiErrorResponse(400, 'Please upload a video file')


    const { title, description } = req.body

    if (!title) throw new ApiErrorResponse(400, 'please input title');
    if (!description) throw new ApiErrorResponse(400, 'please input description');


    var videoLink = await uploadFile(req.files.video[0].path)
        ;
    var video = await Videos.create({
        owner: req.user._id,
        videoFile: videoLink.url,
        title: title,
        description: description,
        duration: 0

    })

    if (!video) throw new ApiErrorResponse(500, 'something went wrong uploading video');
    return res.status(200).json(new ApiResponse(200, video, 'success'));
})

const getVideoById = asyncHandler(async (req, res) => {
    if (!req.body && !req.params && !req.query) throw new ApiErrorResponse(400, 'please input proper values');
    if (!req.body.videoId) throw new ApiErrorResponse(400, 'please input videoid')
    let videos = await Videos.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.body.videoId)
                //    owner: req.user._id
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "user_details",
                pipeline: [
                    {
                        $project: {
                            userName: 1, avatar: 1, coverImage: 1
                        }
                    }
                ]
            },
        }, {
            $project: {
                videoFile: 1, user_details: 1
            }
        }
    ])

    if (!videos) throw new ApiErrorResponse(400, 'videos not found');
    return res.status(200).json(new ApiResponse(200, videos, 'Success'));

})

const updateVideo = asyncHandler(async (req, res) => {
    if (!req.body && !req.params && !req.query) throw new ApiErrorResponse(400, 'please input proper values');
    if (!req.body.videoId && !req.params.videoId && !req.query.videoId) throw new ApiErrorResponse(400, 'please input videoid')
    if (!req.body.description && !req.params.description && !req.query.description) throw new ApiErrorResponse(400, 'please input description')
    if (!req.body.title && !req.params.title && !req.query.title) throw new ApiErrorResponse(400, 'please input title')
    let videos = await Videos.findByIdAndUpdate(req.body.videoId || req.params.videoId || req.query.videoId, {
        $set: {
            description: req.body.description || req.params.description || req.query.description,
            title: req.body.title || req.params.title || req.query.title
        }
    })
    if (!videos) throw new ApiErrorResponse(400, 'videos not found');
    await videos.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, videos, 'Data Updated Successfully'))
})

const deleteVideo = asyncHandler(async (req, res) => {
    if (!req.body && !req.params && !req.query) throw new ApiErrorResponse(400, 'please input proper values');
    if (!req.body.videoId && !req.params.videoId && !req.query.videoId) throw new ApiErrorResponse(400, 'please input videoid')

    let videos = await Videos.findByIdAndDelete(req.body.videoId || req.params.videoId || req.query.videoId, {
    });

    let newVideosList = await Videos.aggregate([
        {
            $match: {
                //    owner: req.user._id
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "user_details",
                pipeline: [
                    {
                        $project: {
                            userName: 1, avatar: 1, coverImage: 1
                        }
                    }
                ]
            },
        }, {
            $project: {
                videoFile: 1, user_details: 1, title: 1, description: 1
            }
        }
    ])

    return res.status(200).json(new ApiResponse(200, newVideosList, 'Data Updated Successfully'))

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    if (!req.body && !req.params && !req.query) throw new ApiErrorResponse(400, 'please input proper values');
    if (!req.body.videoId && !req.params.videoId && !req.query.videoId) throw new ApiErrorResponse(400, 'please input videoid')
    if (!req.body.publishStatus && !req.params.publishStatus && !req.query.publishStatus) throw new ApiErrorResponse(400, 'please input status value')


    let videos = await Videos.findByIdAndUpdate(req.body.videoId || req.params.videoId || req.query.videoId, {
        $set: {
            isPublished: req.body.publishStatus || req.params.publishStatus || req.query.publishStatus
        }
    }, {
        new: true
    });



    return res.status(200).json(new ApiResponse(200, videos, 'Data Updated Successfully'))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}