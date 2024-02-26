"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const server_1 = __importDefault(require("../controllers/server"));
const router = express_1.default.Router();
// Server management routes
router.get('/all', server_1.default.getAllServers);
router.get('/discover', server_1.default.discoverServers);
router.get('/discover/search', server_1.default.searchDiscoverServers);
// router.get('/:serverId', ServerController.getServerById);
router.post('/', server_1.default.createServer);
router.post('/:serverId', server_1.default.updateServer);
router.delete('/:serverId', server_1.default.deleteServer);
router.get('/:serverId/members', server_1.default.getAllMembersByServer);
router.post('/:serverId/join', server_1.default.joinToServer);
router.post('/:serverId/remove', server_1.default.removeFromServer);
exports.default = router;
