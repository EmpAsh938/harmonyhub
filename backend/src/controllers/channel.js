"use strict";
// src/controllers/ChannelController.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const channel_1 = __importDefault(require("../models/channel"));
const getUserId_1 = require("../utils/getUserId");
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("../models/user"));
// Example controller functions for channel operations
const ChannelController = {
    getAllChannelsByServer: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = (0, getUserId_1.getUserIdFromAuthorizationHeader)(req);
            if (!userId) {
                res.status(401);
                throw new Error('Invalid User');
            }
            // Extract the server ID from the request parameters or from the request context
            const serverId = req.params.serverId; // Assuming the server ID is passed in the request parameters
            // If no serverId is found, return an error
            if (!serverId) {
                res.status(400);
                throw new Error('No Server Id provided');
            }
            // Pagination parameters
            const page = parseInt(req.query.page) || 1;
            const rows = parseInt(req.query.rows) || 10; // Default rows per page
            // Calculate skip value based on pagination parameters
            const skip = (page - 1) * rows;
            // Query the database to find all channels associated with the server ID
            let channels = yield channel_1.default.find({ serverId, isDeleted: false }).skip(skip) // Skip records for pagination
                .limit(rows); // Limit the number of records per page;
            // If no servers are found, return an empty array
            if (channels.length === 0) {
                res.status(404);
                throw new Error('No channels found');
            }
            // Filter out private channels if the user is not a member
            channels = channels.filter(channel => {
                if (!channel.isPrivate) {
                    return true;
                }
                return channel.members.some(member => new mongoose_1.default.Types.ObjectId(member).equals(userId));
            });
            // Return success response with the list of channels
            res.json({ success: true, result: channels });
        }
        catch (error) {
            // Pass any errors to the error handling middleware
            next(error);
        }
    }),
    getAllMembersByChannel: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Get the channel ID from the request parameters
            const channelId = req.params.channelId;
            // If no channelId is found, return an error
            if (!channelId) {
                res.status(400);
                throw new Error('No Channel Id provided');
            }
            // Find the channel document in the database based on the channel ID
            const channel = yield channel_1.default.findById(channelId).populate('members');
            // If no channel is found, return an error
            if (!channel) {
                res.status(404);
                throw new Error('Channel not found');
            }
            // If no server is found, return an error
            if (channel.members.length == 0) {
                res.status(404);
                throw new Error('Users not found');
            }
            // Return success response with the list of members
            res.json({ success: true, result: channel.members });
        }
        catch (error) {
            // Pass any errors to the error handling middleware
            next(error);
        }
    }),
    createChannel: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Extract channel details from the request body
            const { name, serverId, type, isPrivate } = req.body;
            const ownerId = (0, getUserId_1.getUserIdFromAuthorizationHeader)(req);
            if (!ownerId) {
                res.status(401);
                throw new Error('Invalid User');
            }
            const members = [ownerId];
            // Create a new channel document
            const newChannel = new channel_1.default({
                name,
                serverId,
                ownerId,
                members,
                type,
                deletable: false,
                isDeleted: false,
                isPrivate // Assuming isPrivate is a boolean attribute
            });
            // Save the new channel document to the database
            const savedChannel = yield newChannel.save();
            // Return success response
            res.status(201).json({ success: true, result: savedChannel });
        }
        catch (error) {
            // Pass any errors to the error handling middleware
            next(error);
        }
    }),
    joinToChannel: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { channelId, users } = req.body;
            if (!channelId) {
                res.status(400);
                throw new Error('Channel ID missing');
            }
            const userId = (0, getUserId_1.getUserIdFromAuthorizationHeader)(req);
            if (!userId) {
                res.status(401);
                throw new Error('Invalid User');
            }
            const channel = yield channel_1.default.findById(channelId);
            if (!channel) {
                res.status(404);
                throw new Error('Channel not found');
            }
            let updatedChannel;
            for (const user of users) {
                let resultUser = yield user_1.default.findOne({ username: user });
                if (resultUser) {
                    updatedChannel = yield channel_1.default.findByIdAndUpdate(channelId, { $push: { members: resultUser._id } });
                }
            }
            if ((!users || users.length == 0) && !channel.members.includes(userId)) {
                updatedChannel = yield channel_1.default.findByIdAndUpdate(channelId, { $push: { members: userId } });
            }
            updatedChannel = yield channel_1.default.findById(channelId);
            return res.json({
                success: true,
                result: updatedChannel,
            });
        }
        catch (error) {
            next(error);
        }
    }),
    removeFromChannel: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { channelId, userId } = req.body;
            if (!channelId) {
                res.status(400);
                throw new Error('Channel ID missing');
            }
            if (!userId) {
                res.status(400);
                throw new Error('User is missing');
            }
            let channel = yield channel_1.default.findById(channelId);
            if (!channel) {
                res.status(404);
                throw new Error('Channel not found');
            }
            channel = yield channel_1.default.findByIdAndUpdate(channelId, { $pull: { members: userId } });
            return res.json({
                success: true,
                result: channel,
            });
        }
        catch (error) {
            next(error);
        }
    }),
    updateChannel: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Extract channel ID from request parameters
            const channelId = req.params.channelId;
            // Extract updated channel details from request body
            const { name, type, isPrivate } = req.body;
            // Find channel document in the database by ID
            const channelToUpdate = yield channel_1.default.findById(channelId);
            if (!channelToUpdate) {
                res.status(404);
                throw new Error('Channel not found');
            }
            // Update channel properties
            if (name) {
                channelToUpdate.name = name;
            }
            if (type) {
                channelToUpdate.type = type;
            }
            if (isPrivate !== undefined) {
                channelToUpdate.isPrivate = isPrivate;
            }
            // Save updated channel document
            const updatedChannel = yield channelToUpdate.save();
            // Return success response with updated channel
            res.json({ success: true, result: updatedChannel });
        }
        catch (error) {
            next(error);
        }
    }),
    deleteChannel: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Extract channel ID from request parameters
            const channelId = req.params.channelId;
            // Find channel document in the database by ID and delete it
            const deletedChannel = yield channel_1.default.findByIdAndUpdate(channelId, { isDeleted: true });
            if (!deletedChannel) {
                res.status(404);
                throw new Error('Channel not found');
            }
            // Return success response
            res.json({ success: true, result: deletedChannel });
        }
        catch (error) {
            next(error);
        }
    })
};
exports.default = ChannelController;
