"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logging_1 = __importDefault(require("./middleware/logging"));
const errorHandle_1 = __importDefault(require("./middleware/errorHandle"));
const auth_1 = __importDefault(require("./routes/auth"));
const user_1 = __importDefault(require("./routes/user"));
const server_1 = __importDefault(require("./routes/server"));
const channel_1 = __importDefault(require("./routes/channel"));
const message_1 = __importDefault(require("./routes/message"));
const task_1 = __importDefault(require("./routes/task"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const socketServer_1 = __importDefault(require("./socket/socketServer"));
// Initialize dotenv for loading environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app); // Create an HTTP server
// Connect to MongoDB
(0, db_1.connectDB)();
// Apply middleware
app.use((0, cors_1.default)()); // Allow all origins, you can configure more options if needed
app.use(express_1.default.json()); // Request parsing middleware
app.use(logging_1.default); // Logging middleware
// Add authentication middleware to routes that require authentication
// Add other middleware as needed
// Mount routes
app.use('/api/auth', auth_1.default);
app.use('/api/users', user_1.default);
app.use('/api/servers', server_1.default);
app.use('/api/channels', channel_1.default);
app.use('/api/messages', message_1.default);
app.use('/api/tasks', task_1.default);
// Error handling middleware (must be placed at the end of middleware chain)
app.use(errorHandle_1.default);
// initialize Socket.IO
(0, socketServer_1.default)(httpServer);
// Start the server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
