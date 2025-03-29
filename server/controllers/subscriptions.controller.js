import { Subscription } from "../models/subscriptions.models.js";
import { ApiErrorResponse } from "../utils/ApiErrorResponse.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";





const toggleSubscription = asyncHandler(async (req, res) => {
    if (!req.body && !req.query && !req.params) throw new ApiErrorResponse(400, 'please input value');
    const { channelId } = req.body.channel_id || req.query.channel_id || req.params.channel_id;


    if (!req.body.type && !req.query.type && !req.params.type) throw new ApiErrorResponse(400, 'please input type');

    if (req.body.type == 1 || req.query.type == 1 || req.params.type == 1) {
        let findChannel = await Subscription.findOne({
            channel: channelId,
        });

        if (!findChannel) {
            let channel = await Subscription.create({
                channel: channelId,
                likedBy: req.user._id
            },);
            return res.status(200).json(new ApiResponse(200, channel, 'success'));
        }
        else {
            return res.status(200).json(new ApiResponse(200, findChannel, 'You already are already subscribed'));
        }
    }

    else if (req.body.type == 0 || req.query.type == 0 || req.params.type == 0) {
        let channel = await Subscription.findOneAndDelete({
            channel: channelId,
        });
        if (!channel) throw new ApiErrorResponse(400, "video not found");
        return res.status(200).json(new ApiResponse(200, channel, 'success'));
    }

})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    if (!req.body && !req.query && !req.params) throw new ApiErrorResponse(400, 'please input value');
    const { channelId } = req.body.channel_id || req.query.channel_id || req.params.channel_id;

    let allSubscribers = await Subscription.aggregate([
        {
            $match: {
                channel: channelId
            }
        }
    ]);

    if (!allSubscribers) throw new ApiErrorResponse(200, 'this channel has no subscribers!');

    return res.status(200).json(new ApiResponse(200, allSubscribers, 'Success'));

})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    if (!req.body && !req.query && !req.params) throw new ApiErrorResponse(400, 'please input value');
    const { subscriberId } = req.body || req.query || req.params;

    let allSubscriptions = await Subscription.findById(subscriberId);

    if (!allSubscriptions) throw new ApiErrorResponse(200, 'this user has not subscribe to any channel');

    return res.status(200).json(new ApiResponse(200, allSubscriptions, 'Success'));
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}