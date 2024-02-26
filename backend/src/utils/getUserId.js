"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserIdFromAuthorizationHeader = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Function to retrieve user ID from authorization header
function getUserIdFromAuthorizationHeader(req) {
    // Retrieve the authorization header from the request
    const authHeader = req.headers.authorization;
    // Check if the authorization header is present and starts with 'Bearer '
    if (authHeader && authHeader.startsWith('Bearer ')) {
        // Extract the token from the authorization header
        const token = authHeader.split('Bearer')[1].trim();
        // Decode the token to extract user ID
        const decoded = jsonwebtoken_1.default.decode(token);
        // Check if decoding was successful and user ID exists in the token payload
        if (decoded && decoded._doc._id) {
            // Return the user ID
            return decoded._doc._id;
        }
    }
    // If the authorization header is missing or doesn't start with 'Bearer ', return null
    return null;
}
exports.getUserIdFromAuthorizationHeader = getUserIdFromAuthorizationHeader;
