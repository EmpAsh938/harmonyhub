"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
function initializeSocketServer(httpServer) {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: '*',
        }
    });
    io.on('connection', (socket) => {
        console.log(`New client connected: ${socket.id}`);
        // Handle disconnection
        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
        // join the channels
        socket.on('join channel', (room) => {
            socket.join(room);
            console.log(`${socket.id} joined room: ${room}`);
        });
        // send/receive the messages
        socket.on('chat', (room, message) => {
            io.to(room).emit('chat', message);
            console.log(`${socket.id} broadcasted message:`);
        });
        // Error handling
        socket.on('error', (error) => {
            console.error(`Socket error: ${error}`);
        });
    });
}
exports.default = initializeSocketServer;
