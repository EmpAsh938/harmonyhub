import express from 'express';
import ServerController from '../controllers/server';

const router = express.Router();

// Server management routes
router.get('/all', ServerController.getAllServers);
router.get('/discover', ServerController.discoverServers);
router.get('/discover/search', ServerController.searchDiscoverServers);
// router.get('/:serverId', ServerController.getServerById);
router.post('/', ServerController.createServer);
router.post('/:serverId', ServerController.updateServer);
router.delete('/:serverId', ServerController.deleteServer);
router.get('/:serverId/members', ServerController.getAllMembersByServer);
router.post('/:serverId/join', ServerController.joinToServer);
router.post('/:serverId/remove', ServerController.removeFromServer);

export default router;

