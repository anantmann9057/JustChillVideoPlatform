import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import { addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylistById, getUserPlaylists, removeVideoFromPlaylist, updatePlaylist } from "../controllers/playlist.controller.js";


const playlistRouter = Router();
playlistRouter.route("/create-playlist").post(verifyJwt, createPlaylist);
playlistRouter.route("/get-user-playlist").get(verifyJwt, getUserPlaylists);
playlistRouter.route("/get-playlist").get(verifyJwt, getPlaylistById);
playlistRouter.route("/add-to-playlist").post(verifyJwt, addVideoToPlaylist);
playlistRouter.route("/remove-from-playlist").delete(verifyJwt, removeVideoFromPlaylist);
playlistRouter.route("/remove-playlist").delete(verifyJwt, deletePlaylist);
playlistRouter.route("/update-playlist").put(verifyJwt, updatePlaylist);
export default playlistRouter;