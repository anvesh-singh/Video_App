import { Socket } from "socket.io";
import http from "http";
import express from 'express';
import { Server } from 'socket.io';
import { UserManager } from "./managers/UserManger";
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

const userManager = new UserManager();

// Define a proxy middleware for the desired paths
const proxyMiddleware = createProxyMiddleware('/api', {
  target: 'http://172.31.102.29:3128',
  changeOrigin: true,
});

// Use the proxy middleware in your app
app.use('/api', proxyMiddleware);

io.on('connection', (socket: Socket) => {
  console.log('a user connected');
  userManager.addUser("randomName", socket);
  socket.on("disconnect", () => {
    console.log("user disconnected");
    userManager.removeUser(socket.id);
  })
});

// Start the server
const PORT = 3000;
const HOST = '172.31.72.1';

server.listen(PORT, HOST, () => {
  console.log(`Server listening at http://${HOST}:${PORT}`);
});
