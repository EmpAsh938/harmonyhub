import express from 'express';
import Auth from '../controllers/auth';

const router = express.Router();

// Authentication routes
router.post('/register', Auth.register);
router.post('/login', Auth.login);
router.post('/logout', Auth.logout);

export default router;