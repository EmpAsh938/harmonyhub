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
const server_1 = __importDefault(require("../models/server"));
const user_1 = __importDefault(require("../models/user"));
const channel_1 = __importDefault(require("../models/channel"));
const getUserId_1 = require("../utils/getUserId");
const ServerController = {
    getAllServers: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = (0, getUserId_1.getUserIdFromAuthorizationHeader)(req);
            if (!userId) {
                res.status(401);
                throw new Error('Invalid User');
            }
            // Pagination parameters
            const page = parseInt(req.query.page) || 1;
            const rows = parseInt(req.query.rows) || 10; // Default rows per page
            // Calculate skip value based on pagination parameters
            const skip = (page - 1) * rows;
            // Find all servers where the user is a member
            const servers = yield server_1.default.find({ members: userId, isDeleted: false })
                .skip(skip) // Skip records for pagination
                .limit(rows); // Limit the number of records per page;
            // If no servers are found, return an empty array
            if (servers.length === 0) {
                res.status(404);
                throw new Error('No servers found for the user');
            }
            // Return the list of servers in the response
            return res.json({
                success: true,
                result: servers
            });
        }
        catch (error) {
            next(error);
        }
    }),
    getAllMembersByServer: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Get the server ID from the request parameters
            const serverId = req.params.serverId;
            // If no serverId is found, return an error
            if (!serverId) {
                res.status(400);
                throw new Error('No Server Id provided');
            }
            // Find the server document in the database based on the server ID
            const server = yield server_1.default.findById(serverId).populate('members');
            // If no server is found, return an error
            if (!server) {
                res.status(404);
                throw new Error('Server not found');
            }
            // If no server is found, return an error
            if (server.members.length == 0) {
                res.status(404);
                throw new Error('Users not found');
            }
            // Return success response with the list of members
            res.json({ success: true, result: server.members });
        }
        catch (error) {
            // Pass any errors to the error handling middleware
            next(error);
        }
    }),
    joinToServer: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { serverId, users } = req.body;
            if (!serverId) {
                res.status(400);
                throw new Error('Server ID missing');
            }
            const userId = (0, getUserId_1.getUserIdFromAuthorizationHeader)(req);
            if (!userId) {
                res.status(401);
                throw new Error('Invalid User');
            }
            const server = yield server_1.default.findById(serverId);
            if (!server) {
                res.status(404);
                throw new Error('Server not found');
            }
            let updatedServer;
            for (const user of users) {
                let resultUser = yield user_1.default.findOne({ username: user });
                if (resultUser) {
                    updatedServer = yield server_1.default.findByIdAndUpdate(serverId, { $push: { members: resultUser._id } });
                }
            }
            if ((!users || users.length == 0) && !server.members.includes(userId)) {
                updatedServer = yield server_1.default.findByIdAndUpdate(serverId, { $push: { members: userId } });
            }
            updatedServer = yield server_1.default.findById(serverId);
            return res.json({
                success: true,
                result: updatedServer,
            });
        }
        catch (error) {
            next(error);
        }
    }),
    removeFromServer: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { serverId, userId } = req.body;
            if (!serverId) {
                res.status(400);
                throw new Error('Server ID missing');
            }
            if (!userId) {
                res.status(400);
                throw new Error('User is missing');
            }
            const server = yield server_1.default.findById(serverId);
            if (!server) {
                res.status(404);
                throw new Error('Server not found');
            }
            let updatedServer = yield server_1.default.findByIdAndUpdate(serverId, { $pull: { members: userId } });
            updatedServer = yield server_1.default.findById(serverId);
            return res.json({
                success: true,
                result: updatedServer,
            });
        }
        catch (error) {
            next(error);
        }
    }),
    discoverServers: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Pagination parameters
            const page = parseInt(req.query.page) || 1;
            const rows = parseInt(req.query.rows) || 10; // Default rows per page
            // Calculate skip value based on pagination parameters
            const skip = (page - 1) * rows;
            // Discover servers with the most members
            const servers = yield server_1.default.find({ isDeleted: false })
                .sort({ members: -1 }) // Sort by the number of members (descending)
                .skip(skip) // Skip records for pagination
                .limit(rows); // Limit the number of records per page
            // If no servers are found, return an empty array
            if (servers.length === 0) {
                res.status(404);
                throw new Error('No servers found');
            }
            // Send response with discovered servers
            res.json({ success: true, result: servers });
        }
        catch (error) {
            next(error);
        }
    }),
    createServer: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Extract server details from the request body
            const { name, description, icon } = req.body;
            const ownerId = (0, getUserId_1.getUserIdFromAuthorizationHeader)(req);
            if (!ownerId) {
                res.status(401);
                throw new Error('Invalid User');
            }
            const members = [ownerId];
            // Create a new server document
            const newServer = new server_1.default({
                name,
                ownerId,
                description,
                icon,
                isDeleted: false,
                members
            });
            // Save the new server document to the database
            const savedServer = yield newServer.save();
            // Create a new channel document
            const textChannel = new channel_1.default({
                name: "general",
                serverId: newServer._id,
                ownerId,
                members,
                type: "text",
                deletable: false,
                isDeleted: false,
                isPrivate: false // Assuming isPrivate is a boolean attribute
            });
            // Create a new channel document
            const videoChannel = new channel_1.default({
                name: "general",
                serverId: newServer._id,
                ownerId,
                members,
                type: "video",
                deletable: false,
                isDeleted: false,
                isPrivate: false // Assuming isPrivate is a boolean attribute
            });
            // Save the new channel document to the database
            yield textChannel.save();
            yield videoChannel.save();
            // Return success response
            res.status(201).json({ success: true, result: savedServer });
        }
        catch (error) {
            // Pass any errors to the error handling middleware
            next(error);
        }
    }),
    searchDiscoverServers: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const query = req.query.query; // Search query
            const page = req.query.page ? parseInt(req.query.page) : 1; // Page number
            const rows = req.query.rows ? parseInt(req.query.rows) : 10; // Number of rows per page
            // Search for servers based on the query
            const servers = yield server_1.default.find({ name: { $regex: query, $options: 'i' } }) // Case-insensitive search
                .skip((page - 1) * rows)
                .limit(rows);
            // If no servers are found, return an empty array
            if (servers.length === 0) {
                res.status(404);
                throw new Error('No servers found');
            }
            res.json({ success: true, result: servers });
        }
        catch (error) {
            next(error);
        }
    }),
    updateServer: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Extract the server ID from the request parameters
            const { serverId } = req.params;
            // Find the server document in the database by its ID
            const serverToUpdate = yield server_1.default.findById(serverId);
            if (!serverToUpdate) {
                // If the server with the provided ID is not found, return a 404 response
                res.status(404);
                throw new Error('Server not found');
            }
            // Extract updated server details from the request body
            const { name, description, icon } = req.body;
            // Update the server document with the new data
            if (name) {
                serverToUpdate.name = name;
            }
            if (description) {
                serverToUpdate.description = description;
            }
            if (icon) {
                serverToUpdate.icon = icon;
            }
            // Save the updated server document to the database
            const updatedServer = yield serverToUpdate.save();
            // Return success response with the updated server document
            res.json({ success: true, result: updatedServer });
        }
        catch (error) {
            // Pass any errors to the error handling middleware
            next(error);
        }
    }),
    deleteServer: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Extract the server ID from the request parameters
            const { serverId } = req.params;
            // Find the server document in the database by its ID and delete it
            const deletedServer = yield server_1.default.findByIdAndUpdate(serverId, { isDeleted: true });
            if (!deletedServer) {
                // If the server with the provided ID is not found, return a 404 response
                res.status(404);
                throw new Error('Server not found');
            }
            // Return success response
            res.json({ success: true, result: deletedServer });
        }
        catch (error) {
            // Pass any errors to the error handling middleware
            next(error);
        }
    })
};
exports.default = ServerController;
