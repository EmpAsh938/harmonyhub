import { NextFunction, Request, Response } from 'express';
import ServerModel, { ServerDocument } from '../models/server';
import UserModel, { UserDocument } from '../models/user';
import ChannelModel, { ChannelDocument } from '../models/channel';
import { getUserIdFromAuthorizationHeader } from '../utils/getUserId';

const ServerController = {
    getAllServers: async (req: Request, res: Response, next: NextFunction) => {

        try {
            const userId = getUserIdFromAuthorizationHeader(req);

            if (!userId) {
                res.status(401);
                throw new Error('Invalid User');
            }
            // Pagination parameters
            const page = parseInt(req.query.page as string) || 1;
            const rows = parseInt(req.query.rows as string) || 10; // Default rows per page

            // Calculate skip value based on pagination parameters
            const skip = (page - 1) * rows;

            // Find all servers where the user is a member
            const servers: ServerDocument[] = await ServerModel.find({ members: userId, isDeleted: false })
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
        } catch (error) {
            next(error);
        }
    },
    getAllMembersByServer: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Get the server ID from the request parameters
            const serverId = req.params.serverId;

            // If no serverId is found, return an error
            if (!serverId) {
                res.status(400);
                throw new Error('No Server Id provided');
            }

            // Find the server document in the database based on the server ID
            const server = await ServerModel.findById(serverId).populate('members');

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
        } catch (error) {
            // Pass any errors to the error handling middleware
            next(error);
        }
    },
    joinToServer: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { serverId, users } = req.body;

            if (!serverId) {
                res.status(400);
                throw new Error('Server ID missing');
            }


            const userId = getUserIdFromAuthorizationHeader(req);
            if (!userId) {
                res.status(401);
                throw new Error('Invalid User');
            }

            const server = await ServerModel.findById(serverId);

            if (!server) {
                res.status(404);
                throw new Error('Server not found');
            }


            let updatedServer;

            for (const user of users) {
                let resultUser: UserDocument | null = await UserModel.findOne({ username: user });
                if (resultUser) {
                    updatedServer = await ServerModel.findByIdAndUpdate(serverId, { $push: { members: resultUser._id } });
                }
            }

            if ((!users || users.length == 0) && !server.members.includes(userId)) {
                updatedServer = await ServerModel.findByIdAndUpdate(serverId, { $push: { members: userId } });
            }

            updatedServer = await ServerModel.findById(serverId);

            return res.json({
                success: true,
                result: updatedServer,
            })
        } catch (error) {
            next(error)
        }
    },
    removeFromServer: async (req: Request, res: Response, next: NextFunction) => {
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

            const server = await ServerModel.findById(serverId);

            if (!server) {
                res.status(404);
                throw new Error('Server not found');
            }

            let updatedServer = await ServerModel.findByIdAndUpdate(serverId, { $pull: { members: userId } });


            updatedServer = await ServerModel.findById(serverId);

            return res.json({
                success: true,
                result: updatedServer,
            })
        } catch (error) {
            next(error)
        }
    },
    discoverServers: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Pagination parameters
            const page = parseInt(req.query.page as string) || 1;
            const rows = parseInt(req.query.rows as string) || 10; // Default rows per page

            // Calculate skip value based on pagination parameters
            const skip = (page - 1) * rows;

            // Discover servers with the most members
            const servers = await ServerModel.find({ isDeleted: false })
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
        } catch (error) {
            next(error);
        }
    },
    createServer: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Extract server details from the request body
            const { name, description, icon } = req.body;

            const ownerId = getUserIdFromAuthorizationHeader(req);
            if (!ownerId) {
                res.status(401);
                throw new Error('Invalid User');
            }

            const members: string[] = [ownerId];

            // Create a new server document
            const newServer: ServerDocument = new ServerModel({
                name,
                ownerId,
                description,
                icon,
                isDeleted: false,
                members
            });

            // Save the new server document to the database
            const savedServer = await newServer.save();

            // Create a new channel document
            const textChannel: ChannelDocument = new ChannelModel({
                name: "general",
                serverId: newServer._id,
                ownerId,
                members,
                type: "text",
                deletable: false,
                isDeleted: false,
                isPrivate: false  // Assuming isPrivate is a boolean attribute
            });

            // Create a new channel document
            const videoChannel: ChannelDocument = new ChannelModel({
                name: "general",
                serverId: newServer._id,
                ownerId,
                members,
                type: "video",
                deletable: false,
                isDeleted: false,
                isPrivate: false  // Assuming isPrivate is a boolean attribute
            });

            // Save the new channel document to the database
            await textChannel.save();
            await videoChannel.save();

            // Return success response
            res.status(201).json({ success: true, result: savedServer });
        } catch (error) {
            // Pass any errors to the error handling middleware
            next(error);
        }
    },
    searchDiscoverServers: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = req.query.query as string; // Search query
            const page = req.query.page ? parseInt(req.query.page as string) : 1; // Page number
            const rows = req.query.rows ? parseInt(req.query.rows as string) : 10; // Number of rows per page

            // Search for servers based on the query
            const servers = await ServerModel.find({ name: { $regex: query, $options: 'i' } }) // Case-insensitive search
                .skip((page - 1) * rows)
                .limit(rows);

            // If no servers are found, return an empty array
            if (servers.length === 0) {
                res.status(404);
                throw new Error('No servers found');
            }

            res.json({ success: true, result: servers });
        } catch (error) {
            next(error);
        }
    },
    updateServer: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Extract the server ID from the request parameters
            const { serverId } = req.params;

            // Find the server document in the database by its ID
            const serverToUpdate = await ServerModel.findById(serverId);

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
            const updatedServer = await serverToUpdate.save();

            // Return success response with the updated server document
            res.json({ success: true, result: updatedServer });
        } catch (error) {
            // Pass any errors to the error handling middleware
            next(error);
        }
    },
    deleteServer: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Extract the server ID from the request parameters
            const { serverId } = req.params;

            // Find the server document in the database by its ID and delete it
            const deletedServer = await ServerModel.findByIdAndUpdate(serverId, { isDeleted: true });

            if (!deletedServer) {
                // If the server with the provided ID is not found, return a 404 response
                res.status(404);
                throw new Error('Server not found');
            }

            // Return success response
            res.json({ success: true, result: deletedServer });
        } catch (error) {
            // Pass any errors to the error handling middleware
            next(error);
        }
    }
};

export default ServerController;

