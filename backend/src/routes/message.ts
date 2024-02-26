import express from 'express';
import MessageController from '../controllers/message';

const router = express.Router();

// Message routes
router.post('/', MessageController.saveMessage);
router.put('/', MessageController.updateMessage);
router.get('/:channelId', MessageController.getAllMessagesByChannel);
router.delete('/:messageId', MessageController.deleteMessage);

export default router;

