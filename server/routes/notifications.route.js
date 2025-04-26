import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import { getNotifications, sendLikeNotification } from "../controllers/notifications.controller.js";
const notificationsRouter = Router();

notificationsRouter
  .route("/send-like-notification")
  .post(verifyJwt, sendLikeNotification);
  
  notificationsRouter
  .route("/get-notification")
  .get(verifyJwt, getNotifications);

export default notificationsRouter;
