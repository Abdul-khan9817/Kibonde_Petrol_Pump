// socket-client.js - Socket.io client for real-time notifications
import { io } from 'https://cdn.socket.io/4.7.5/socket.io.esm.min.js';

export function connectUserSocket(userKey, onReply) {
  const socket = io('http://localhost:5000'); // adjust if backend runs elsewhere
  socket.on('connect', () => {
    socket.emit('join', userKey);
  });
  socket.on('adminReply', (replyData) => {
    if (onReply) onReply(replyData);
  });
  return socket;
}
