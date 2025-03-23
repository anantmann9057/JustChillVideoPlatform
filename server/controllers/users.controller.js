import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiErrorResponse } from "../utils/ApiErrorResponse.js"
const registerUser = asyncHandler(async (req, res) => {
    if (!req.body) return res.json(new ApiErrorResponse(401, req.body, 'error'));

    return res.json(new ApiResponse(200, req.body, 'Success'))
});


export {
    registerUser
}