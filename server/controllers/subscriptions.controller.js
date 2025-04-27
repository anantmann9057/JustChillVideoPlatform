import { Subscription } from "../models/subscriptions.models.js";
import { ApiErrorResponse } from "../utils/ApiErrorResponse.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import extractInput from "../utils/Helper.js";

// Toggle subscription
const toggleSubscription = asyncHandler(async (req, res) => {
    const { channel_id, type } = extractInput(req, ["channel_id", "type"]);

    if (type === 1) {
        const existingSubscription = await Subscription.findOne({ channel: channel_id });
        if (existingSubscription) {
            return res.status(200).json(new ApiResponse(200, existingSubscription, "You are already subscribed"));
        }

        const newSubscription = await Subscription.create({
            channel: channel_id,
            likedBy: req.user._id,
        });

        return res.status(200).json(new ApiResponse(200, newSubscription, "Subscription successful"));
    } else if (type === 0) {
        const deletedSubscription = await Subscription.findOneAndDelete({ channel: channel_id });
        if (!deletedSubscription) throw new ApiErrorResponse(400, "Subscription not found");

        return res.status(200).json(new ApiResponse(200, deletedSubscription, "Unsubscribed successfully"));
    } else {
        throw new ApiErrorResponse(400, "Invalid subscription type");
    }
});

// Get subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channel_id } = extractInput(req, ["channel_id"]);

    const subscribers = await Subscription.aggregate([
        { $match: { channel: channel_id } },
    ]);

    if (!subscribers || subscribers.length === 0) {
        throw new ApiErrorResponse(200, "This channel has no subscribers");
    }

    return res.status(200).json(new ApiResponse(200, subscribers, "Success"));
});

// Get channels a user has subscribed to
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriber_id } = extractInput(req, ["subscriber_id"]);

    const subscriptions = await Subscription.find({ likedBy: subscriber_id });

    if (!subscriptions || subscriptions.length === 0) {
        throw new ApiErrorResponse(200, "This user has not subscribed to any channels");
    }

    return res.status(200).json(new ApiResponse(200, subscriptions, "Success"));
});

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels,
};