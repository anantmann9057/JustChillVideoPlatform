import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCover,
  getUserChannelProfile,
  getUserWatchHistory,
  updateBio,
} from "../controllers/users.controller.js";
import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
const userRouter = Router();

userRouter.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

userRouter.route("/login").post(loginUser);
userRouter.route("/refreshToken").post(verifyJwt, refreshAccessToken);
userRouter.route("/logout").post(verifyJwt, logoutUser);
userRouter.route("/changePassword").post(changeCurrentPassword);
userRouter.route("/getUserDetails").get(verifyJwt, getCurrentUser);
userRouter.route("/updateAccountDetails").post(verifyJwt, updateAccountDetails);
userRouter.route("/updateAvatar").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  verifyJwt,
  updateUserAvatar
);
userRouter.route("/updateCover").post(
  upload.fields([
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  verifyJwt,
  updateUserCover
);
userRouter.route("/getChannelProfile").get(verifyJwt, getUserChannelProfile);
userRouter.route("/getUserWatchHistory").get(verifyJwt, getUserWatchHistory);

userRouter.route("/update-bio").post(verifyJwt, updateBio);
export default userRouter;
