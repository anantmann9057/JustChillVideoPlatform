import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import { createPlaylist, getPlaylistById, getUserPlaylists } from "../controllers/playlist.controller.js";


const playlistRouter = Router();
playlistRouter.route("/create-playlist").post(verifyJwt, createPlaylist);
playlistRouter.route("/get-user-playlist").get(verifyJwt, getUserPlaylists);
playlistRouter.route("/get-playlist").get(verifyJwt, getPlaylistById);
export default playlistRouter;