import express from 'express';
import TaskController from '../controllers/task';

const router = express.Router();

// Task management routes
router.get('/tasks', TaskController.getAllTasks);
router.get('/tasks/:taskId', TaskController.getTaskById);
router.post('/tasks', TaskController.createTask);
router.put('/tasks/:taskId', TaskController.updateTask);
router.delete('/tasks/:taskId', TaskController.deleteTask);

export default router;

