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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Check for the presence of an authentication token in the request headers
    const token = req.headers.authorization;
    if (!token) {
        res.status(401);
        throw new Error('Invalid token');
    }
    try {
        // Validate the token and decode it to extract user information
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || '');
        let isUser = yield user_1.default.findById(decoded._id).exec();
        if (!isUser) {
            res.status(401);
            throw new Error('User not Authorized');
        }
        else {
            next();
        }
        // Proceed to the next middleware or route handler
        next();
    }
    catch (error) {
        res.status(401);
        throw new Error('Invalid token');
    }
});
exports.default = verifyToken;
