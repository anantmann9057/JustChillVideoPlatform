import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import { addComment, deleteComment, updateComment } from "../controllers/comment.controller.js";

const commentRouter = Router();

commentRouter.route('/post-comment').post(verifyJwt, addComment);
commentRouter.route('/update-comment').post(verifyJwt, updateComment);
commentRouter.route('/delete-comment').delete(verifyJwt, deleteComment);

export default commentRouter;