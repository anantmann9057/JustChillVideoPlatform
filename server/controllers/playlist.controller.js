import mongoose, { isValidObjectId } from "mongoose"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiErrorResponse } from "../utils/ApiErrorResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { Playlist } from "../models/playlist.models.js"
import { Videos } from "../models/videos.models.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const name = req.body.title || req.query.title || req.params.title;
    const description = req.body.description || req.query.description || req.params.description;
    const videoId = req.body.video_id || req.query.video_id || req.params.video_id;

    if (!name) throw new ApiErrorResponse(400, 'please provide a title');
    if (!description) throw new ApiErrorResponse(400, 'please provide a description');
    if (!videoId) throw new ApiErrorResponse(400, 'please provide a video Id');

    let existingPlaylist = await Playlist.findOne({
        name: name
    });
    if (!existingPlaylist) {

        let newPlaylist = await Playlist.create({
            owner: req.user._id,
            videos: videoId,
            name: name,
            description: description
        });

        if (!newPlaylist) throw new ApiErrorResponse(400, 'something went wrong creating playlist');

        return res.status(200).json(new ApiResponse(200, newPlaylist, 'success'));

    }
    return res.status(200).json(new ApiResponse(200, {}, 'Playlist already exists'));

})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const userId = req.body.user_id || req.query.user_id || req.params.user_id;
    if (!userId) throw new ApiErrorResponse(400, 'please provide a valid user id');

    let playlist = await Playlist.find({
        owner: userId
    });

    if (!playlist) throw new ApiErrorResponse(400, 'user has no play list!');
    return res.status(200).json(new ApiResponse(200, playlist, 'success'));

})

const getPlaylistById = asyncHandler(async (req, res) => {
    const playlistId = req.body.playlist_id || req.query.playlist_id || req.params.playlist_id;

    if (!playlistId) throw new ApiErrorResponse(400, 'please provide a valid playlist id');

    let playlist = await Playlist.findById(playlistId);

    if (!playlist) throw new ApiErrorResponse(400, 'play list not found');
    return res.status(200).json(new ApiResponse(200, playlist, 'success'));
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const playlistId = req.body.playlist_id || req.query.playlist_id || req.params.playlist_id;
    const videoId = req.body.video_id || req.query.video_id || req.params.video_id;
    if (!playlistId) throw new ApiErrorResponse(400, 'please provide a valid playlist id');
    if (!videoId) throw new ApiErrorResponse(400, 'please provide a valid video id');

    let findVideo = await Videos.findById(videoId);
    if (!findVideo) throw new ApiErrorResponse(400, 'video not found');

    let findPlaylist = await Playlist.findById(playlistId);
    if (!findPlaylist) throw new ApiErrorResponse(400, 'playlist not found');

    let updatedPlaylist = await Playlist.findByIdAndUpdate(playlistId, {
        videos: videoId
    })


    if (!updatedPlaylist) throw new ApiErrorResponse(400, "something went wrong updating playlist");

    return res.status(200).json(new ApiResponse(200, updatePlaylist, 'success'));
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    // TODO: remove video from playlist

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    // TODO: delete playlist
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body
    //TODO: update playlist
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}