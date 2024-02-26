"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const message_1 = __importDefault(require("../controllers/message"));
const router = express_1.default.Router();
// Message routes
router.post('/', message_1.default.saveMessage);
router.put('/', message_1.default.updateMessage);
router.get('/:channelId', message_1.default.getAllMessagesByChannel);
router.delete('/:messageId', message_1.default.deleteMessage);
exports.default = router;
