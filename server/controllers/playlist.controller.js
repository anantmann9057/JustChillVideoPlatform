import mongoose from "mongoose";
import { ApiErrorResponse } from "../utils/ApiErrorResponse.js";
import { Playlist } from "../models/playlist.models.js";
import { Videos } from "../models/videos.models.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import extractInput from "../utils/Helper.js";

// Create a new playlist
const createPlaylist = asyncHandler(async (req, res) => {
    const { title, description, video_id } = extractInput(req, ["title", "description", "video_id"]);

    const existingPlaylist = await Playlist.findOne({ name: title });
    if (existingPlaylist) {
        return res.status(200).json(new ApiResponse(200, {}, "Playlist already exists"));
    }

    const newPlaylist = await Playlist.create({
        owner: req.user._id,
        videos: video_id,
        name: title,
        description,
    });

    if (!newPlaylist) throw new ApiErrorResponse(400, "Failed to create playlist");

    return res.status(200).json(new ApiResponse(200, newPlaylist, "Success"));
});

// Get playlists by user
const getUserPlaylists = asyncHandler(async (req, res) => {
    const { user_id } = extractInput(req, ["user_id"]);

    const playlists = await Playlist.find({ owner: user_id });
    if (!playlists || playlists.length === 0) throw new ApiErrorResponse(400, "No playlists found");

    return res.status(200).json(new ApiResponse(200, playlists, "Success"));
});

// Get playlist by ID
const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlist_id } = extractInput(req, ["playlist_id"]);

    const playlist = await Playlist.findById(playlist_id);
    if (!playlist) throw new ApiErrorResponse(400, "Playlist not found");

    return res.status(200).json(new ApiResponse(200, playlist, "Success"));
});

// Add video to playlist
const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlist_id, video_id } = extractInput(req, ["playlist_id", "video_id"]);

    const video = await Videos.findById(video_id);
    if (!video) throw new ApiErrorResponse(400, "Video not found");

    const playlist = await Playlist.findById(playlist_id);
    if (!playlist) throw new ApiErrorResponse(400, "Playlist not found");

    playlist.videos.push(video_id);
    await playlist.save();

    return res.status(200).json(new ApiResponse(200, playlist, "Video added to playlist successfully"));
});

// Remove video from playlist
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlist_id, video_id } = extractInput(req, ["playlist_id", "video_id"]);

    const playlist = await Playlist.findById(playlist_id);
    if (!playlist) throw new ApiErrorResponse(400, "Playlist not found");

    playlist.videos = playlist.videos.filter((id) => id.toString() !== video_id);
    await playlist.save();

    return res.status(200).json(new ApiResponse(200, playlist, "Video removed from playlist successfully"));
});

// Delete a playlist
const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlist_id } = extractInput(req, ["playlist_id"]);

    const playlist = await Playlist.findByIdAndDelete(playlist_id);
    if (!playlist) throw new ApiErrorResponse(400, "Failed to delete playlist");

    return res.status(200).json(new ApiResponse(200, playlist, "Playlist deleted successfully"));
});

// Update playlist details
const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlist_id, name, description } = extractInput(req, ["playlist_id", "name", "description"]);

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlist_id,
        { name, description },
        { new: true }
    );

    if (!updatedPlaylist) throw new ApiErrorResponse(400, "Failed to update playlist");

    return res.status(200).json(new ApiResponse(200, updatedPlaylist, "Playlist updated successfully"));
});

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist,
};