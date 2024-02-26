import { NextFunction, Request, Response } from 'express';
import MessageModel from '../models/message';
import { getUserIdFromAuthorizationHeader } from '../utils/getUserId';

const MessageController = {
    getAllMessagesByChannel: async (req: Request, res: Response, next: NextFunction) => {
        const channelId = req.params.channelId;
        if (!channelId) {
            res.status(400);
            throw new Error('Channel ID is required');
        }

        // Pagination parameters
        const page = parseInt(req.query.page as string) || 1;
        const rows = parseInt(req.query.rows as string) || 10; // Default rows per page

        // Calculate skip value based on pagination parameters
        const skip = (page - 1) * rows;
        try {
            const messages = await MessageModel.find({ channelId })
                .populate('userId')
                .sort({ createdAt: -1 })
                .skip(skip) // Skip records for pagination
                .limit(rows); // Limit the number of records per page

            if (messages.length == 0) {
                res.status(404);
                throw new Error("Messages cannot be found");
            }

            return res.json({
                success: true,
                result: messages,
            });
        } catch (error) {
            next(error);
        }
    },
    saveMessage: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Extract message data from request body
            const { channelId, media, content } = req.body;

            if (!channelId) {
                res.status(400);
                throw new Error('Channel ID is required');
            }

            const userId = getUserIdFromAuthorizationHeader(req);
            if (!userId) {
                res.status(401);
                throw new Error('Invalid User');
            }


            // Create a new message document
            const newMessage = new MessageModel({
                channelId,
                userId,
                content,
                media
            });

            // Save the message to the database
            await newMessage.save();

            // Populate the userId field with user information
            await newMessage.populate('userId');

            // Return success response
            res.status(201).json({
                success: true,
                result: newMessage
            });
        } catch (error) {
            next(error); // Pass any errors to the error handling middleware
        }
    },
    deleteMessage: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Extract message ID from request parameters
            const messageId = req.params.messageId;

            // Find the message by ID and delete it
            await MessageModel.findByIdAndDelete(messageId);

            // Return success response
            res.json({
                success: true,
                result: 'Message deleted successfully'
            });
        } catch (error) {
            next(error); // Pass any errors to the error handling middleware
        }
    },
    updateMessage: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Extract message ID and updated content from request body
            const messageId = req.params.messageId;
            const { content } = req.body;

            // Find the message by ID and update its content
            const updatedMessage = await MessageModel.findByIdAndUpdate(messageId, { content }, { new: true });

            if (!updatedMessage) {
                // If the message was not found, return an error response
                res.status(404);
                throw new Error('Message not found');
            }

            // Return success response with the updated message
            res.json({
                success: true,
                result: updatedMessage
            });
        } catch (error) {
            next(error); // Pass any errors to the error handling middleware
        }
    },
};

export default MessageController;

