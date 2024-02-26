"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const channel_1 = __importDefault(require("../controllers/channel"));
const router = express_1.default.Router();
// Channel management routes
// router.get('/channels/:channelId', ChannelController.getChannelById);
router.post('/', channel_1.default.createChannel);
router.get('/:serverId', channel_1.default.getAllChannelsByServer);
router.put('/:channelId', channel_1.default.updateChannel);
router.delete('/:channelId', channel_1.default.deleteChannel);
router.get('/:channelId/members', channel_1.default.getAllMembersByChannel);
router.post('/:channelId/join', channel_1.default.joinToChannel);
router.post('/:channelId/remove', channel_1.default.removeFromChannel);
exports.default = router;
