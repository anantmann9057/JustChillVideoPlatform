import { ApiErrorResponse } from "./ApiErrorResponse.js";



const extractInput = (req, keys) => {
    const input = {};
    keys.forEach((key) => {
        input[key] = req.body[key] || req.query[key] || req.params[key];
        if (!input[key]) throw new ApiErrorResponse(400, `Missing or invalid ${key}`);
    });
    return input;
};

export default extractInput;