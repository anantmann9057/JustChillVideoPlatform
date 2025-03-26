import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import userRouter from "./user.route.js";
import { createTweet, getUserTweets } from "../controllers/tweet.controller.js";
const tweetRouter = Router();

// userRouter.route('/register').post(upload.fields([
//     {
//         name: 'avatar', maxCount: 1
//     }
//     ,
//     {
//         name: 'coverImage', maxCount: 1
//     }]), registerUser  
tweetRouter.route('/post-tweet').post(verifyJwt, createTweet);
tweetRouter.route('/get-user-tweets').get(verifyJwt, getUserTweets);
export default tweetRouter;