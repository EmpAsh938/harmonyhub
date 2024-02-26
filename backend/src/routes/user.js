"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../controllers/user"));
const router = express_1.default.Router();
router.get('/', user_1.default.getUserById);
router.put('/', user_1.default.updateUser);
router.delete('/', user_1.default.deleteUser);
router.get('/all', user_1.default.getAllUsers);
router.get('/friends', user_1.default.getFriendList);
router.post('/friends', user_1.default.manageFriend);
router.get('/friends/search', user_1.default.searchFriends);
exports.default = router;
