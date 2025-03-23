import { registerUser } from "../controllers/users.controller.js";
import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
const userRouter = Router();

userRouter.route('/register').post(upload.fields([
    {
        name: 'avatar', maxCount: 1
    }
    ,
    {
        name: 'coverImage', maxCount: 1
    }]), registerUser);

export default userRouter;