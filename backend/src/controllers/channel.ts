// src/controllers/ChannelController.ts

import { NextFunction, Request, Response } from 'express';
import ChannelModel, { ChannelDocument } from '../models/channel';
import { getUserIdFromAuthorizationHeader } from '../utils/getUserId';
import mongoose from 'mongoose';
import UserModel, { UserDocument } from '../models/user';

// Example controller functions for channel operations
const ChannelController = {
    getAllChannelsByServer: async (req: Request, res: Response, next: NextFunction) => {
        try {

            const userId = getUserIdFromAuthorizationHeader(req);

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
            const page = parseInt(req.query.page as string) || 1;
            const rows = parseInt(req.query.rows as string) || 10; // Default rows per page

            // Calculate skip value based on pagination parameters
            const skip = (page - 1) * rows;


            // Query the database to find all channels associated with the server ID
            let channels = await ChannelModel.find({ serverId, isDeleted: false }).skip(skip) // Skip records for pagination
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
                return channel.members.some(member => new mongoose.Types.ObjectId(member).equals(userId));
            });
            // Return success response with the list of channels
            res.json({ success: true, result: channels });
        } catch (error) {
            // Pass any errors to the error handling middleware
            next(error);
        }
    },
    getAllMembersByChannel: async (req: Request, res: Response, next: NextFunction) => {
        try {

            // Get the channel ID from the request parameters
            const channelId = req.params.channelId;

            // If no channelId is found, return an error
            if (!channelId) {
                res.status(400);
                throw new Error('No Channel Id provided');
            }

            // Find the channel document in the database based on the channel ID
            const channel = await ChannelModel.findById(channelId).populate('members');

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
        } catch (error) {
            // Pass any errors to the error handling middleware
            next(error);
        }
    },
    createChannel: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Extract channel details from the request body
            const { name, serverId, type, isPrivate } = req.body;

            const ownerId = getUserIdFromAuthorizationHeader(req);

            if (!ownerId) {
                res.status(401);
                throw new Error('Invalid User');
            }

            const members: string[] = [ownerId];

            // Create a new channel document
            const newChannel: ChannelDocument = new ChannelModel({
                name,
                serverId,
                ownerId,
                members,
                type,
                deletable: false,
                isDeleted: false,
                isPrivate  // Assuming isPrivate is a boolean attribute
            });

            // Save the new channel document to the database
            const savedChannel = await newChannel.save();

            // Return success response
            res.status(201).json({ success: true, result: savedChannel });
        } catch (error) {
            // Pass any errors to the error handling middleware
            next(error);
        }
    },
    joinToChannel: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { channelId, users } = req.body;

            if (!channelId) {
                res.status(400);
                throw new Error('Channel ID missing');
            }


            const userId = getUserIdFromAuthorizationHeader(req);
            if (!userId) {
                res.status(401);
                throw new Error('Invalid User');
            }

            const channel = await ChannelModel.findById(channelId);

            if (!channel) {
                res.status(404);
                throw new Error('Channel not found');
            }


            let updatedChannel;

            for (const user of users) {
                let resultUser: UserDocument | null = await UserModel.findOne({ username: user });
                if (resultUser) {
                    updatedChannel = await ChannelModel.findByIdAndUpdate(channelId, { $push: { members: resultUser._id } });
                }
            }

            if ((!users || users.length == 0) && !channel.members.includes(userId)) {
                updatedChannel = await ChannelModel.findByIdAndUpdate(channelId, { $push: { members: userId } });
            }

            updatedChannel = await ChannelModel.findById(channelId);

            return res.json({
                success: true,
                result: updatedChannel,
            })
        } catch (error) {
            next(error)
        }
    },
    removeFromChannel: async (req: Request, res: Response, next: NextFunction) => {
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

            let channel = await ChannelModel.findById(channelId);

            if (!channel) {
                res.status(404);
                throw new Error('Channel not found');
            }

            channel = await ChannelModel.findByIdAndUpdate(channelId, { $pull: { members: userId } });

            return res.json({
                success: true,
                result: channel,
            })
        } catch (error) {
            next(error)
        }
    },
    updateChannel: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Extract channel ID from request parameters
            const channelId = req.params.channelId;

            // Extract updated channel details from request body
            const { name, type, isPrivate } = req.body;

            // Find channel document in the database by ID
            const channelToUpdate = await ChannelModel.findById(channelId);

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
            const updatedChannel = await channelToUpdate.save();

            // Return success response with updated channel
            res.json({ success: true, result: updatedChannel });
        } catch (error) {
            next(error);
        }
    },
    deleteChannel: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Extract channel ID from request parameters
            const channelId = req.params.channelId;

            // Find channel document in the database by ID and delete it
            const deletedChannel = await ChannelModel.findByIdAndUpdate(channelId, { isDeleted: true });

            if (!deletedChannel) {
                res.status(404);
                throw new Error('Channel not found');
            }

            // Return success response
            res.json({ success: true, result: deletedChannel });
        } catch (error) {
            next(error);
        }
    }
};

export default ChannelController;

