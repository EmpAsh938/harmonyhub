import { NextFunction, Request, Response } from 'express';

import UserModel from '../models/user';
import { getUserIdFromAuthorizationHeader } from '../utils/getUserId';

const User = {
    getAllUsers: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Fetch all users from the database
            const users = await UserModel.find();

            // Check if any users were found
            if (users.length === 0) {
                // Return a 404 error if no users were found
                res.status(404);
                throw new Error('No users found');
            }

            // Return the list of users in the response
            return res.json({ success: true, users });
        } catch (error) {
            next(error);
        }
    },
    getUserById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Retrieve user ID from authorization header
            const userId = getUserIdFromAuthorizationHeader(req);
            if (!userId) {
                // If user ID is not found in the authorization header, return unauthorized error
                res.status(401);
                throw new Error('Unauthorized');
            }

            // Fetch the user from the database by ID
            const user = await UserModel.findById(userId).populate('friends');

            // Check if any user was found
            if (!user) {
                // Return a 404 error if no user was found
                res.status(400);
                throw new Error('User not found');
            }

            // Return the user in the response
            return res.json({
                success: true,
                result: user
            });
        } catch (error) {
            next(error);
        }
    },
    updateUser: async (req: Request, res: Response, next: NextFunction) => {
        const { username, bio } = req.body;

        try {
            if (!username || !bio) {
                res.status(400).json({ error: 'Username and bio are required fields' });
                return;
            }

            const userId = getUserIdFromAuthorizationHeader(req);

            let user = await UserModel.findById(userId);

            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            user.username = username;
            user.bio = bio;
            await user.save();

            await user.populate('friends');

            res.json({
                success: true,
                result: user
            });
        } catch (error) {
            next(error);
        }
    },
    deleteUser: (req: Request, res: Response) => {
        // Implement logic to delete a user
    },
    getFriendList: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = getUserIdFromAuthorizationHeader(req);
            if (!userId) {
                res.status(401);
                throw new Error('Invalid User');
            }
            // Fetch the user document by its ID
            const user = await UserModel.findById(userId);

            if (!user) {
                res.status(404);
                throw new Error('User not found');
            }

            // Pagination parameters
            const page = parseInt(req.query.page as string) || 1;
            const rows = parseInt(req.query.rows as string) || 10; // Default rows per page

            // Calculate skip value based on pagination parameters
            const skip = (page - 1) * rows;

            // Retrieve the friends array from the user document
            const friendIds = user.friends;

            // Populate the friends array to get the detailed information of each friend
            const friends = await UserModel.find({ _id: { $in: friendIds } })
                .skip(skip) // Skip records for pagination
                .limit(rows); // Limit the number of records per page
            // If no servers are found, return an empty array
            if (friends.length === 0) {
                res.status(404);
                throw new Error('No friends found');
            };

            // Send the populated friend list as the response
            res.json({ success: true, result: friends });
        } catch (error) {
            next(error);
        }
    },
    manageFriend: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { friendId } = req.body; // Friend ID to add or remove

            const userId = getUserIdFromAuthorizationHeader(req);
            if (!userId) {
                res.status(401);
                throw new Error('Invalid User');
            }

            // Check if the friendId is provided in the request body
            if (!friendId) {
                res.status(400);
                throw new Error('Friend ID is required');
            }

            // Fetch the user document by its ID
            let user = await UserModel.findById(userId);

            if (!user) {
                res.status(400);
                throw new Error('User not found');
            }

            // Check if the friendId is already in the user's friend list
            const isFriend = user.friends.includes(friendId);

            // If the friendId is not in the friend list, add it; otherwise, remove it
            if (!isFriend) {
                // Add the friendId to the user's friend list
                await UserModel.findByIdAndUpdate(userId, { $push: { friends: friendId } });
            } else {
                // Remove the friendId from the user's friend list
                await UserModel.findByIdAndUpdate(userId, { $pull: { friends: friendId } });
            }

            // Fetch the updated user document with populated friends
            user = await UserModel.findById(userId).populate('friends');

            // Send the updated user document in the response
            res.json({ success: true, result: user });
        } catch (error) {
            next(error);
        }

    },
    searchFriends: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const searchTerm = req.query.q; // Search term provided in the query parameter


            const userId = getUserIdFromAuthorizationHeader(req);
            if (!userId) {
                res.status(401);
                throw new Error('Invalid User');
            }

            // Fetch the user document by its ID
            const user = await UserModel.findById(userId);

            if (!user) {
                res.status(404);
                throw new Error('User not found');
            }


            // Search for friends whose username or email matches the search term
            const searchResults = await UserModel.find({
                _id: { $in: user.friends }, // Search within the user's friend list
                $or: [
                    { username: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive username search
                    { email: { $regex: searchTerm, $options: 'i' } } // Case-insensitive email search
                ]
            }).select('_id username email avatar');

            res.json({ success: true, result: searchResults });
        } catch (error) {
            next(error);
        }
    },
};

export default User;

