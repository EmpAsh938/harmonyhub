import { Request } from 'express';
import jwt from 'jsonwebtoken';


// Function to retrieve user ID from authorization header
export function getUserIdFromAuthorizationHeader(req: Request): string | null {
    // Retrieve the authorization header from the request
    const authHeader = req.headers.authorization;

    // Check if the authorization header is present and starts with 'Bearer '
    if (authHeader && authHeader.startsWith('Bearer ')) {
        // Extract the token from the authorization header
        const token = authHeader.split('Bearer')[1].trim();
        // Decode the token to extract user ID
        const decoded: any = jwt.decode(token);

        // Check if decoding was successful and user ID exists in the token payload
        if (decoded && decoded._doc._id) {
            // Return the user ID
            return decoded._doc._id;
        }
    }

    // If the authorization header is missing or doesn't start with 'Bearer ', return null
    return null;
}
