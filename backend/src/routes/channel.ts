import express from 'express';
import ChannelController from '../controllers/channel';

const router = express.Router();

// Channel management routes
// router.get('/channels/:channelId', ChannelController.getChannelById);
router.post('/', ChannelController.createChannel);
router.get('/:serverId', ChannelController.getAllChannelsByServer);
router.put('/:channelId', ChannelController.updateChannel);
router.delete('/:channelId', ChannelController.deleteChannel);
router.get('/:channelId/members', ChannelController.getAllMembersByChannel);
router.post('/:channelId/join', ChannelController.joinToChannel);
router.post('/:channelId/remove', ChannelController.removeFromChannel);

export default router;

