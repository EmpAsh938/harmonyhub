"use strict";
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
const message_1 = __importDefault(require("../models/message"));
const getUserId_1 = require("../utils/getUserId");
const MessageController = {
    getAllMessagesByChannel: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const channelId = req.params.channelId;
        if (!channelId) {
            res.status(400);
            throw new Error('Channel ID is required');
        }
        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const rows = parseInt(req.query.rows) || 10; // Default rows per page
        // Calculate skip value based on pagination parameters
        const skip = (page - 1) * rows;
        try {
            const messages = yield message_1.default.find({ channelId })
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
        }
        catch (error) {
            next(error);
        }
    }),
    saveMessage: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Extract message data from request body
            const { channelId, media, content } = req.body;
            if (!channelId) {
                res.status(400);
                throw new Error('Channel ID is required');
            }
            const userId = (0, getUserId_1.getUserIdFromAuthorizationHeader)(req);
            if (!userId) {
                res.status(401);
                throw new Error('Invalid User');
            }
            // Create a new message document
            const newMessage = new message_1.default({
                channelId,
                userId,
                content,
                media
            });
            // Save the message to the database
            yield newMessage.save();
            // Populate the userId field with user information
            yield newMessage.populate('userId');
            // Return success response
            res.status(201).json({
                success: true,
                result: newMessage
            });
        }
        catch (error) {
            next(error); // Pass any errors to the error handling middleware
        }
    }),
    deleteMessage: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Extract message ID from request parameters
            const messageId = req.params.messageId;
            // Find the message by ID and delete it
            yield message_1.default.findByIdAndDelete(messageId);
            // Return success response
            res.json({
                success: true,
                result: 'Message deleted successfully'
            });
        }
        catch (error) {
            next(error); // Pass any errors to the error handling middleware
        }
    }),
    updateMessage: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Extract message ID and updated content from request body
            const messageId = req.params.messageId;
            const { content } = req.body;
            // Find the message by ID and update its content
            const updatedMessage = yield message_1.default.findByIdAndUpdate(messageId, { content }, { new: true });
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
        }
        catch (error) {
            next(error); // Pass any errors to the error handling middleware
        }
    }),
};
exports.default = MessageController;
