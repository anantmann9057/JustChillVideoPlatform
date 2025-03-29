import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/likes.controller.js";

const likesRouter = Router();

likesRouter.route('/liked-videos').get(verifyJwt, getLikedVideos);
likesRouter.route('/toggle-video-like').post(verifyJwt, toggleVideoLike);
likesRouter.route('/toggle-tweet-like').post(verifyJwt, toggleTweetLike);
likesRouter.route('/toggle-comment-like').post(verifyJwt, toggleCommentLike);
likesRouter.route('/toggle-video-like').post(verifyJwt, toggleVideoLike);

export default likesRouter;