import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import UserModel from '../models/user';

const Auth = {
    register: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Extract user details from request body
            const { username, email, password } = req.body;

            if (!email || !password || !username) {
                res.status(400);
                throw new Error('Email or Password or Username is empty');
            }

            // Check if the email is already registered
            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                res.status(400);
                throw new Error('Email is already registered');
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a new user document
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword
            });

            // Save the user to the database
            await newUser.save();

            // Return success response
            res.status(201).json({
                success: true,
                message: 'User registered successfully'
            });

        } catch (error) {
            next(error);
        }
    },
    login: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Extract email and password from request body
            const { email, password } = req.body;

            if (!email || !password) {
                res.status(400);
                throw new Error('Email or Password is empty');
            }

            // Find the user by email
            const user = await UserModel.findOne({ email });
            if (!user) {
                res.status(401);
                throw new Error('Invalid email or password');
            }

            // Compare passwords
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                res.status(401);
                throw new Error('Invalid email or password');
            }

            // Generate JWT token
            const token = jwt.sign({ ...user }, process.env.JWT_SECRET || '', { expiresIn: '7d' });

            // Return token in response
            res.json({
                success: true,
                result: token
            });
        } catch (error) {
            next(error);
        }
    },
    logout: async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.json({
                success: true,
                message: 'Logout successful'
            });

        } catch (error) {
            next(error);
        }
    },
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
};

export default Auth;

