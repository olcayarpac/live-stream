const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');

class SocketService {
  constructor() {
    this.io = null;
    this.connectedSockets = {};
  }

  startSocketServer(server) {
    console.log('Socket service started');
    this.io = socketIo(server);

    this.io.on('connection', (socket) => {
      console.log('New connection:', socket.id);

      socket.on('joinStream', (streamId) => {
        console.log(`Device ${socket.id} joined stream ${streamId}`);
        // Save the socket in a room corresponding to the streamId
        socket.join(streamId);
      });

      socket.on('stream', (streamId, videoChunk) => {
        console.log(`Streaming data received for stream ${streamId}`);
        
        // Broadcast the video chunk to all devices in the same stream
        this.io.to(streamId).emit('stream', videoChunk);
      });

      socket.on('disconnect', () => {
        console.log(`Device ${socket.id} disconnected`);
        // Handle disconnection, leave any rooms if necessary
      });
    });
  }

  // Optional: Save the video chunk to a file
  saveVideoChunk(streamId, videoChunk) {
    const filePath = path.join(__dirname, `stream_${streamId}.mp4`);
    fs.appendFileSync(filePath, videoChunk, 'base64');
  }
}

module.exports = new SocketService();
