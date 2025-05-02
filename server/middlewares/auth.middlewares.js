import jwt from "jsonwebtoken";
import { ApiErrorResponse } from "../utils/ApiErrorResponse.js";
import { User } from "../models/users.models.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { getMessaging, getToken } from "firebase/messaging";

export const verifyJwt = asyncHandler(async (req, res, next) => {
  console.log(req.header("Authorization"));
  if (!req.cookies.refreshToken && req.header("Authorization") == undefined) {
    throw new ApiErrorResponse(401, "User is not logged in!");
  }
  const token =
    req.cookies.refreshToken ||
    req.header("Authorization").replace("Bearer ", "");
  let decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  if (!decodedToken) throw new ApiErrorResponse(401, "invalid token");

  var user = await User.findById(decodedToken._id).select(
    "-password -refreshToken"
  );

  if (!user) throw new ApiErrorResponse(200, "user not found");

  req.user = user;

  next();
});
