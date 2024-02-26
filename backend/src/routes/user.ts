import express from 'express';
import User from '../controllers/user';

const router = express.Router();



router.get('/', User.getUserById);
router.put('/', User.updateUser);
router.delete('/', User.deleteUser);
router.get('/all', User.getAllUsers);
router.get('/friends', User.getFriendList);
router.post('/friends', User.manageFriend);
router.get('/friends/search', User.searchFriends);

export default router;

