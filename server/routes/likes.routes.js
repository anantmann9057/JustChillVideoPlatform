import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import {
  getLikedVideos,
 
  toggleVideoLike,
  getVideoLikedStatus,
  getTotalLikesOnVideos,
  unlikeVideo,
} from "../controllers/likes.controller.js";

const likesRouter = Router();

likesRouter.route("/liked-videos").get(verifyJwt, getLikedVideos);
likesRouter.route("/toggle-video-unlike").post(verifyJwt, unlikeVideo);
likesRouter.route("/video-like-status").get(verifyJwt, getVideoLikedStatus);
likesRouter.route("/toggle-video-like").post(verifyJwt, toggleVideoLike);
likesRouter.route("/get-video-likes").get(getTotalLikesOnVideos);

export default likesRouter;
