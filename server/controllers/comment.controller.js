import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiErrorResponse } from "../utils/ApiErrorResponse.js";
import { Comment } from "../models/comment.models.js";
const getVideoComments = asyncHandler(async (req, res) => {
    if (!req.body && !req.query && !req.params) throw new ApiErrorResponse(400, 'please input value');

    if (!req.body.video_id && !req.query.video_id && !req.params.video_id) throw new ApiErrorResponse(400, 'invalid video id!');


    const { videoId } = req.body.video_id || req.query.video_id || req.params.video_id;
    const { page = 1, limit = 10 } = req.query

    let videoComments = await Comment.findById(videoId);

    if (!videoComments) throw new ApiErrorResponse(200, 'no comments on this video');


    return res.status(200).json(new ApiResponse(200, videoComments, 'Success'));


})

const addComment = asyncHandler(async (req, res) => {

    if (!req.body && !req.query && !req.params) throw new ApiErrorResponse(400, 'please input value');
    if (!req.body.video_id && !req.query.video_id && !req.params.video_id) throw new ApiErrorResponse(400, 'invalid video id!');
    if (!req.body.comment && !req.query.comment && !req.params.comment) throw new ApiErrorResponse(400, 'please input comment');

    const videoId = req.body.video_id || req.query.video_id || req.params.video_id;
    const comment = req.body.comment || req.query.comment || req.params.comment;

    let insertComment = await Comment.create({
        videos: videoId,
        owner: req.user._id,
        content: comment
    });

    if (!insertComment) throw new ApiErrorResponse(400, 'something went wrong publishing comment')

    return res.status(200).json(new ApiResponse(200, insertComment, 'success'));

})

const updateComment = asyncHandler(async (req, res) => {
    if (!req.body && !req.query && !req.params) throw new ApiErrorResponse(400, 'please input value');
    if (!req.body.comment_id && !req.query.comment_id && !req.params.comment_id) throw new ApiErrorResponse(400, 'invalid comment id!');
    if (!req.body.comment && !req.query.comment && !req.params.comment) throw new ApiErrorResponse(400, 'please input comment');


    const commentId = req.body.comment_id || req.query.comment_id || req.params.comment_id;
    const comment = req.body.comment || req.query.comment || req.params.comment;

    let updateComment = await Comment.findByIdAndUpdate(commentId, {
        $set: {
            content: comment
        }
    }, {
        new: true
    });
    await updateComment.save({ validateBeforeSave: false })

    if (!updateComment) throw new ApiErrorResponse(400, 'Something went wrong!');


    return res.status(200).json(new ApiResponse(200, updateComment, 'success'));

})

const deleteComment = asyncHandler(async (req, res) => {
    if (!req.body && !req.query && !req.params) throw new ApiErrorResponse(400, 'please input value');
    if (!req.body.comment_id && !req.query.comment_id && !req.params.comment_id) throw new ApiErrorResponse(400, 'invalid comment id!');


    const commentId = req.body.comment_id || req.query.comment_id || req.params.comment_id;

    let updateComment = await Comment.findByIdAndDelete(commentId,);

    if (!updateComment) throw new ApiErrorResponse(400, 'Something went wrong!');


    return res.status(200).json(new ApiResponse(200, {}, 'success'));
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}