import express from "express";
import cors from "cors";
import { connectDB } from "./db/index.js";
import healthcheckRouter from "./routes/healthcheck.routes.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import tweetRouter from "./routes/tweet.route.js";
import videosRouter from "./routes/videos.route.js";
import likesRouter from "./routes/likes.routes.js";
import { errorHandler } from "./middlewares/error.middlewares.js";
import subsRouter from "./routes/subscriptions.route.js";
import commentRouter from "./routes/comment.route.js";
import playlistRouter from "./routes/playlist.route.js";
import notificationsRouter from "./routes/notifications.route.js";
const app = express();
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

//common middleware
app.use(
  express.json({
    limit: "50mb",
  })
);
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("public"));

connectDB();

app.get("/", (req, res) => {
  res.json({
    message: "hello",
  });
});




app.use("/api/v1/healthCheck", healthcheckRouter);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videosRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/likes", likesRouter);
app.use("/api/v1/subscriptions", subsRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/playlist", playlistRouter);
app.use("/api/v1/notifications", notificationsRouter);

app.use(errorHandler);
export { app };
