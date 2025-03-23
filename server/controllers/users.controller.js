import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiErrorResponse } from "../utils/ApiErrorResponse.js"
import { User } from '../models/users.models.js';
import { deleteFile, uploadFile } from "../utils/Cloudinary.js";
const registerUser = asyncHandler(async (req, res) => {
    if (!req.body) throw new ApiErrorResponse(400, 'bruh! Atleast send something');


    const { fullname,
        email,
        password,
        username, avatar } = req.body

    if ([fullname,
        email,
        password,
        username].some((field) => field == null)) throw new ApiErrorResponse(409, 'input all fields');

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


export {
    registerUser
}