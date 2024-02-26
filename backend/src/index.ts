import express from 'express';
import loggingMiddleware from './middleware/logging';
import errorHandlingMiddleware from './middleware/errorHandle';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import serverRoutes from './routes/server';
import channelRoutes from './routes/channel';
import messageRoutes from './routes/message';
import taskRoutes from './routes/task';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import initializeSocketServer from './socket/socketServer';

// Initialize dotenv for loading environment variables
dotenv.config();

const app = express();
const httpServer = http.createServer(app); // Create an HTTP server


// Connect to MongoDB
connectDB();

// Apply middleware
app.use(cors()); // Allow all origins, you can configure more options if needed
app.use(express.json()); // Request parsing middleware
app.use(loggingMiddleware); // Logging middleware
// Add authentication middleware to routes that require authentication
// Add other middleware as needed

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/servers', serverRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/tasks', taskRoutes);

// Error handling middleware (must be placed at the end of middleware chain)
app.use(errorHandlingMiddleware);

// initialize Socket.IO
initializeSocketServer(httpServer);

// Start the server
const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
