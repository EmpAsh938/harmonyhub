import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user';

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    // Check for the presence of an authentication token in the request headers
    const token = req.headers.authorization;

    if (!token) {
        res.status(401);
        throw new Error('Invalid token');
    }

    try {
        // Validate the token and decode it to extract user information
        const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as { _id: string };

        let isUser = await UserModel.findById(decoded._id).exec();
        if (!isUser) {
            res.status(401);
            throw new Error('User not Authorized');
        } else {
            next();
        }

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        res.status(401);
        throw new Error('Invalid token');
    }
};

export default verifyToken;
