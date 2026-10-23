// socket.js - Socket.io setup for real-time notifications
const { Server } = require('socket.io');

let io;
function initSocket(server) {
  io = new Server(server, {
    cors: { origin: '*' }
  });

  io.on('connection', (socket) => {
    // Listen for user to join their own room (by email or userId)
    socket.on('join', (userKey) => {
      socket.join(userKey);
    });
  });
}

// Call this when admin replies to a message:
function notifyUserReply(userKey, replyData) {
  if (io) {
    io.to(userKey).emit('adminReply', replyData);
  }
}

module.exports = { initSocket, notifyUserReply };
