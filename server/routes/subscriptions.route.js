import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../controllers/subscriptions.controller.js";
const subsRouter = Router();

// userRouter.route('/register').post(upload.fields([
//     {
//         name: 'avatar', maxCount: 1
//     }
//     ,
//     {
//         name: 'coverImage', maxCount: 1
//     }]), registerUser  
subsRouter.route('/toggle-subscription').post(verifyJwt, toggleSubscription);
subsRouter.route('/all-subscribers').get(verifyJwt, getUserChannelSubscribers);
subsRouter.route('/all-subscriptions').get(verifyJwt, getSubscribedChannels);

export default subsRouter;