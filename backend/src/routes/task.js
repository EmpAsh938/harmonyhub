"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const task_1 = __importDefault(require("../controllers/task"));
const router = express_1.default.Router();
// Task management routes
router.get('/tasks', task_1.default.getAllTasks);
router.get('/tasks/:taskId', task_1.default.getTaskById);
router.post('/tasks', task_1.default.createTask);
router.put('/tasks/:taskId', task_1.default.updateTask);
router.delete('/tasks/:taskId', task_1.default.deleteTask);
exports.default = router;
