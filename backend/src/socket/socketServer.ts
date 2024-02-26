import http from 'http';
import { Server, Socket } from 'socket.io';


export default function initializeSocketServer(httpServer: http.Server) {
    const io = new Server(httpServer, {
        cors: {
            origin: '*',
        }
    });

    io.on('connection', (socket: Socket) => {
        console.log(`New client connected: ${socket.id}`);

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });

        // join the channels
        socket.on('join channel', (room) => {
            socket.join(room);
            console.log(`${socket.id} joined room: ${room}`);
        })
        // send/receive the messages
        socket.on('chat', (room, message) => {
            io.to(room).emit('chat', message);
            console.log(`${socket.id} broadcasted message:`);
        })

        // Error handling
        socket.on('error', (error: Error) => {
            console.error(`Socket error: ${error}`);
        });
    });
}

