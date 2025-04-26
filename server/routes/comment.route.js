import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import { addComment, deleteComment, updateComment,getVideoComments } from "../controllers/comment.controller.js";

const commentRouter = Router();

commentRouter.route('/post-comment').post(verifyJwt, addComment);
commentRouter.route('/update-comment').post(verifyJwt, updateComment);
commentRouter.route('/delete-comment').delete(verifyJwt, deleteComment);
commentRouter.route('/get-video-comments').get( getVideoComments);

export default commentRouter;