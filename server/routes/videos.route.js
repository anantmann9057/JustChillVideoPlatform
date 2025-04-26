import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updateVideo,
  addtoWatchHistory,
  testUpload,
} from "../controllers/videos.controller.js";
const videosRouter = Router();

// userRouter.route('/register').post(upload.fields([
//     {
//         name: 'avatar', maxCount: 1
//     }
//     ,
//     {
//         name: 'coverImage', maxCount: 1
//     }]), registerUser
videosRouter.route("/get-videos").get(verifyJwt, getAllVideos);
videosRouter.route("/upload-video").post(
  verifyJwt,
  upload.fields([
    {
      name: "video",
      maxCount: 1,
    },
  ]),
  publishAVideo
);

videosRouter.route("/get-videos-by-id").get(verifyJwt, getVideoById);
videosRouter.route("/update-video-details").post(
  verifyJwt,
  upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  updateVideo
);
videosRouter.route("/delete-video").delete(verifyJwt, deleteVideo);
videosRouter
  .route("/toggle-publish-status")
  .post(verifyJwt, togglePublishStatus);
videosRouter.route("/update-watch-history").post(verifyJwt, addtoWatchHistory);

videosRouter.route("/test-upload").post(verifyJwt, testUpload);
export default videosRouter;
