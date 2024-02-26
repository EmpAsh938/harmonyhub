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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const Auth = {
    register: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Extract user details from request body
            const { username, email, password } = req.body;
            if (!email || !password || !username) {
                res.status(400);
                throw new Error('Email or Password or Username is empty');
            }
            // Check if the email is already registered
            const existingUser = yield user_1.default.findOne({ email });
            if (existingUser) {
                res.status(400);
                throw new Error('Email is already registered');
            }
            // Hash the password
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            // Create a new user document
            const newUser = new user_1.default({
                username,
                email,
                password: hashedPassword
            });
            // Save the user to the database
            yield newUser.save();
            // Return success response
            res.status(201).json({
                success: true,
                message: 'User registered successfully'
            });
        }
        catch (error) {
            next(error);
        }
    }),
    login: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Extract email and password from request body
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400);
                throw new Error('Email or Password is empty');
            }
            // Find the user by email
            const user = yield user_1.default.findOne({ email });
            if (!user) {
                res.status(401);
                throw new Error('Invalid email or password');
            }
            // Compare passwords
            const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
            if (!passwordMatch) {
                res.status(401);
                throw new Error('Invalid email or password');
            }
            // Generate JWT token
            const token = jsonwebtoken_1.default.sign(Object.assign({}, user), process.env.JWT_SECRET || '', { expiresIn: '7d' });
            // Return token in response
            res.json({
                success: true,
                result: token
            });
        }
        catch (error) {
            next(error);
        }
    }),
    logout: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            res.json({
                success: true,
                message: 'Logout successful'
            });
        }
        catch (error) {
            next(error);
        }
    }),
    getAllUsers: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Fetch all users from the database
            const users = yield user_1.default.find();
            // Check if any users were found
            if (users.length === 0) {
                // Return a 404 error if no users were found
                res.status(404);
                throw new Error('No users found');
            }
            // Return the list of users in the response
            return res.json({ success: true, users });
        }
        catch (error) {
            next(error);
        }
    }),
};
exports.default = Auth;
