import { User } from "../models/users.models.js";
import { deleteFile, uploadFile } from "../utils/Cloudinary.js";
import jwt from "jsonwebtoken";
import mongoose, { Schema } from "mongoose";
import { ApiErrorResponse } from "../utils/ApiErrorResponse.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import extractInput from "../utils/Helper.js";
import { lookup } from "dns";

// Helper function to validate required fields
const validateFields = (fields, data) => {
    fields.forEach((field) => {
        if (!data[field]) throw new ApiErrorResponse(400, `Missing required field: ${field}`);
    });
};

// Helper function to upload files
const uploadFiles = async (files) => {
    const uploadedFiles = {};
    if (files.avatar?.[0]) {
        uploadedFiles.avatar = await uploadFile(files.avatar[0].path);
    }
    if (files.coverImage?.[0]) {
        uploadedFiles.coverImage = await uploadFile(files.coverImage[0].path);
    }
    return uploadedFiles;
};

// Register a new user
const registerUser = asyncHandler(async (req, res) => {
    validateFields(["fullname", "email", "password", "username"], req.body);

    const { fullname, email, password, username } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) throw new ApiErrorResponse(409, "User already exists");

    const { avatar, coverImage } = await uploadFiles(req.files);

    try {
        const newUser = await User.create({
            userName: username,
            fullname,
            email,
            password,
            avatar: avatar?.url,
            coverImage: coverImage?.url,
        });

        return res.status(200).json(new ApiResponse(200, newUser, "User registered successfully!"));
    } catch (error) {
        if (avatar) await deleteFile(avatar.public_id);
        if (coverImage) await deleteFile(coverImage.public_id);
        throw new ApiErrorResponse(500, error.message);
    }
});

// Generate access and refresh tokens
const generateAccessAndRefreshToken = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw new ApiErrorResponse(404, "User not found");

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
};

// Login user
const loginUser = asyncHandler(async (req, res) => {
    validateFields(["email", "username", "password"], req.body);

    const { email, username, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (!existingUser) throw new ApiErrorResponse(403, "User not found, please register!");

    const isPasswordCorrect = await existingUser.isPasswordCorrect(password);
    if (!isPasswordCorrect) throw new ApiErrorResponse(403, "Wrong password!");

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(existingUser._id);

    const options = { httpOnly: true, secure: process.env.NODE_ENV === "production" };

    const loggedInUser = await User.findById(existingUser._id).select("-password -createdAt -updatedAt");

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { loggedInUser, accessToken, refreshToken }, "Login successful!"));
});

// Logout user
const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { $set: { refreshToken: null } }, { new: true });

    const options = { httpOnly: true, secure: process.env.NODE_ENV === "production" };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, "User logged out successfully"));
});

// Refresh access token
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) throw new ApiErrorResponse(401, "You have been logged out!");

    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (!decodedToken) throw new ApiErrorResponse(401, "Token expired");

    const user = await User.findById(decodedToken._id).select("-password -createdAt -updatedAt -__v");
    if (!user) throw new ApiErrorResponse(401, "Session expired, please login again!");

    if (incomingRefreshToken !== user.refreshToken) throw new ApiErrorResponse(401, "Invalid refresh token");

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const options = { httpOnly: true, secure: process.env.NODE_ENV === "production" };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { user, refreshToken }, "Token refreshed successfully"));
});

// Change current password
const changeCurrentPassword = asyncHandler(async (req, res) => {
    validateFields(["username", "email", "password"], req.body);

    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (!existingUser) throw new ApiErrorResponse(404, "User not found");

    existingUser.password = password;
    await existingUser.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, existingUser, "Password updated successfully"));
});

// Get current user
const getCurrentUser = asyncHandler((req, res) => {
    return res.status(200).json(new ApiResponse(200, req.user, "Success"));
});

// Update account details
const updateAccountDetails = asyncHandler(async (req, res) => {
    validateFields(["username"], req.body);

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $set: { userName: req.body.username } },
        { new: true }
    );

    if (!updatedUser) throw new ApiErrorResponse(500, "Unable to update user");

    return res.status(200).json(new ApiResponse(200, updatedUser, "Account updated successfully"));
});

// Update user avatar
const updateUserAvatar = asyncHandler(async (req, res) => {
    if (!req.files.avatar?.[0]) throw new ApiErrorResponse(400, "Please upload an avatar file");

    const avatar = await uploadFile(req.files.avatar[0].path);
    if (!avatar) throw new ApiErrorResponse(500, "Something went wrong uploading the image");

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $set: { avatar: avatar.url } },
        { new: true }
    );

    if (!updatedUser) throw new ApiErrorResponse(500, "Unable to update avatar");

    return res.status(200).json(new ApiResponse(200, updatedUser, "Avatar updated successfully"));
});

// Update user cover image
const updateUserCover = asyncHandler(async (req, res) => {
    if (!req.files.coverImage?.[0]) throw new ApiErrorResponse(400, "Please upload a cover image file");

    const coverImage = await uploadFile(req.files.coverImage[0].path);
    if (!coverImage) throw new ApiErrorResponse(500, "Something went wrong uploading the image");

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $set: { coverImage: coverImage.url } },
        { new: true }
    );

    if (!updatedUser) throw new ApiErrorResponse(500, "Unable to update cover image");

    return res.status(200).json(new ApiResponse(200, updatedUser, "Cover image updated successfully"));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {

});

const getUserWatchHistory = asyncHandler(async (req, res) => {
    let watchHistory = await User.findById(req.user._id);
    if (!watchHistory) throw new ApiErrorResponse(409, 'Nothing found!');

    var filteredData = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: 'videos',
                localField: 'watchHistory',
                foreignField: '_id',
                as: 'watchHistory'
            }
        },

        {
            $project: {
                _id: 0,
                watchHistory: 1
            }
        }
    ]);
    return res.status(200).json(new ApiResponse(200, filteredData[0], 'success'));
});

// Export all controllers
export {
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
    getUserWatchHistory
};