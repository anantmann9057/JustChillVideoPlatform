import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import { createTweet, deleteTweet, getUserTweets, updateTweet } from "../controllers/tweet.controller.js";
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
tweetRouter.route('/update-tweet').post(verifyJwt, updateTweet);
tweetRouter.route('/delete-tweet').delete(verifyJwt, deleteTweet);
export default tweetRouter;