import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiErrorResponse } from "../utils/ApiErrorResponse.js"
import { User } from '../models/users.models.js';
import { deleteFile, uploadFile } from "../utils/Cloudinary.js";
import jwt from 'jsonwebtoken';
const registerUser = asyncHandler(async (req, res) => {
    console.log(req.body);
    if (!req.body) throw new ApiErrorResponse(400, 'bruh! Atleast send something');


    const { fullname,
        email,
        password,
        username, avatar } = req.body

    if (!fullname) {
        throw new ApiErrorResponse(409, 'input all fullname');
    }
    else if (!email) {
        throw new ApiErrorResponse(409, 'input all email');
    }
    else if (!password) {
        throw new ApiErrorResponse(409, 'input all password');
    }
    else if (!username) {
        throw new ApiErrorResponse(409, 'input all username');
    }



    var user = await User.findOne({
        $or: [{ username }, { email }]

    });

    if (user) throw new ApiErrorResponse(409, 'user already exists');

    var avatarUrl = await uploadFile(req.files.avatar[0].path);


    var coverImageUrl = await uploadFile(req.files.coverImage[0].path);

    try {
        var newUser = await User.create({
            userName: username, fullname: fullname, email: email, password: password, avatar: avatarUrl.url, coverImage: coverImageUrl.url
        });

        return res.json(new ApiResponse(200, newUser, 'user registered successfully!'))
    } catch (error) {
        if (avatarUrl) await deleteFile(avatarUrl.public_id);

        if (coverImageUrl) await deleteFile(coverImageUrl.public_id);

        throw new ApiErrorResponse(500, error.message);
    }
});

const generateAccessandRefreshToken = async (userId) => {


    try {
        const user = await User.findById(userId);

        if (!user) throw new ApiErrorResponse(404, 'User not found');
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        console.log(accessToken);

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiErrorResponse(500, error.message)
    }

};

const loginUser = asyncHandler(async (req, res) => {
    if (!req.body) throw new ApiErrorResponse(400, 'bruh! Atleast send something');

    const { email, username, password } = req.body;
    if ([email, username, password].some((element) => element == null)) {
        throw new ApiErrorResponse(409, 'please fill values');
    }
    let existingUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!existingUser) throw new ApiErrorResponse(403, "User Not found, please check your input or register!");

    let isPasswordCorrect = await existingUser.isPasswordCorrect(password);

    if (!isPasswordCorrect) throw new ApiErrorResponse(403, "Wrong password!")

    const { accessToken, refreshToken } = await generateAccessandRefreshToken(existingUser._id);

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    };

    let loggedInUser = await User.findById(existingUser._id).select('-password -createdAt -updatedAt');

    return res.status(200).cookie('accessToken', accessToken, options).cookie('refreshToken', refreshToken, options).json(new ApiResponse(200, { loggedInUser, accessToken, refreshToken }, 'Welcome you have logged in successfully!'));
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findOneAndUpdate(req.user._id, {
        $set: {
            refreshToken: null
        },

    }, {
        new: true
    });

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    };

    return res.status(200).clearCookie('accessToken', options).clearCookie('refreshToken', options).json(new ApiResponse(200, 'User logout successfully'));

});


const refreshAccessToken = asyncHandler(async (req, res) => {
    if (!req.cookies.refreshToken && !req.body.refreshToken) {
        throw new ApiErrorResponse(401, 'you have been logged out!');
    }
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

    if (!decodedToken) {
        throw new ApiErrorResponse(401, 'token expired');
    }

    const user = await User.findById(decodedToken._id).select("-password -createdAt -updatedAt -__v");

    if (!user) throw new ApiErrorResponse(401, 'session exipred please login again!');

    if (incomingRefreshToken != user.refreshToken) {
        throw new ApiErrorResponse(401, 'invalid refresh token');

    }

    const { accessToken, refreshToken } = await generateAccessandRefreshToken(user._id);


    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    };


    return res.status(200).cookie('accessToken', accessToken, options).cookie('refreshToken', refreshToken, options).json(new ApiResponse(200, {
        user: user,
        refreshToken: incomingRefreshToken
    }));

});


const changeCurrentPassword = asyncHandler(async (req, res) => {
    if (!req.body.username && !req.body.email) throw new ApiErrorResponse(401, 'please input atleast some value');
    const { username, email, password } = req.body;
    let existingUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!password) throw new ApiErrorResponse(405, 'Please insert password');
    if (!existingUser) throw new ApiErrorResponse(404, "user not found with following details! please cross check")

    existingUser.password = password;
    await existingUser.save({ validateBeforeSave: false });
    return res.json(new ApiResponse(200, existingUser));

});

const getCurrentUser = asyncHandler((req, res) => {
    return res.status(200).json(new ApiResponse(200, req.user, 'success'));
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    if (!req.body['username']) throw new ApiErrorResponse(500, 'please add username to update');

    let existingUser = await User.findByIdAndUpdate(req.user._id, {
        $set: {
            userName: req.body['username']
        }
    }, { new: true });


    await existingUser.save({ validateBeforeSave: false });
    if (!existingUser) throw new ApiErrorResponse(500, 'unable to update user');


    return res.status(200).json(new ApiResponse(200, existingUser));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
    if (!req.files.avatar?.[0]) throw new ApiErrorResponse(400, "Please upload avatar file")
    var avatarUrl = await uploadFile(req.files.avatar[0].path);

    if (!avatarUrl) throw new ApiErrorResponse(500, 'Something went wrong uploading image');
    let newImage = await User.findByIdAndUpdate(req.user._id, {
        $set: {
            avatar: avatarUrl.url
        }
    }, {
        new: true
    })

    await newImage.save({ validateBeforeSave: false });

    if (!newImage) throw new ApiErrorResponse(500, 'Something went wrong uploading image');



    return res.status(200).json(new ApiResponse(200, newImage, 'Image update successfully'));
});

const updateUserCover = asyncHandler(async (req, res) => {
    if (!req.files.coverImage?.[0]) throw new ApiErrorResponse(400, "Please upload cover file")
    var coverUrl = await uploadFile(req.files.coverImage[0].path);

    if (!coverUrl) throw new ApiErrorResponse(500, 'Something went wrong uploading image');
    let newImage = await User.findByIdAndUpdate(req.user._id, {
        $set: {
            coverImage: coverUrl.url
        }
    }, {
        new: true
    })

    await newImage.save({ validateBeforeSave: false });

    if (!newImage) throw new ApiErrorResponse(500, 'Something went wrong uploading image');

    return res.status(200).json(new ApiResponse(200, newImage, 'Image update successfully'));
});


const getUserChannelProfile = asyncHandler(async (req, res) => {
    if (!req.body['username'] && !req.query.username) throw new ApiErrorResponse(400, 'input username ')
    const username = req.body['username'] || req.query.username;
    const channel = await User.aggregate([
        {
            $match: {
                'user_name': `${username?.toLowerCase()}`
            },

        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            },

        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            },

        }, {
            $addFields: {
                subscribersCount: {
                    $size: '$subscribers'
                },
                channelSubscribed: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: {
                            $in: [req.user._id, "$subscribers.subscriber"],
                        }, then: true, else: false
                    }
                }
            },
            //only neccessary data

        },
        {
            $project: {
                // "userName": "asdasdas",
                // "email": "asdasd@asdasd,",
                // "avatar": "http://res.cloudinary.com/dej2glgqx/image/upload/v1742737751/duqq26c3mlrmttfwq9xv.png",
                // "coverImage": "http://res.cloudinary.com/dej2glgqx/image/upload/v1742737756/evhjpit4ttos2ymhrx3g.png",
                // "watchHistory": [],
                userName: 1, email: 1, avatar: 1, subscribersCount: 1, channelsSubscribedTo: 1, isSubscribed: 1, coverImage: 1,
            }
        }
    ]);
    if (!channel) throw new ApiErrorResponse(400, 'Channel not found!');


    res.json(new ApiResponse(200, channel));
});

const getUserWatchHistory = asyncHandler(async (req, res) => {
    if (!req.body['username'] && !req.query.username) throw new ApiErrorResponse(400, 'input username ');
    const username = req.body['username'] || req.query.username;


    const channel = await User.aggregate([
        {
            $match: {
                'user_name': `${username?.toLowerCase()}`
            },

        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            },

        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            },

        }, {
            $addFields: {
                subscribersCount: {
                    $size: '$subscribers'
                },
                channelSubscribed: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: {
                            $in: [req.user._id, "$subscribers.subscriber"],
                        }, then: true, else: false
                    }
                }
            },
            //only neccessary data

        },
        {
            $project: {
                // "userName": "asdasdas",
                // "email": "asdasd@asdasd,",
                // "avatar": "http://res.cloudinary.com/dej2glgqx/image/upload/v1742737751/duqq26c3mlrmttfwq9xv.png",
                // "coverImage": "http://res.cloudinary.com/dej2glgqx/image/upload/v1742737756/evhjpit4ttos2ymhrx3g.png",
                // "watchHistory": [],
                userName: 1, email: 1, avatar: 1, subscribersCount: 1, channelsSubscribedTo: 1, isSubscribed: 1, coverImage: 1,
            }
        }
    ]);

})
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
    getUserChannelProfile
}