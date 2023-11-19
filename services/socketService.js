const socketIo = require('socket.io');

class SocketService {



  startSocketServer(server) {
    console.log('socket service started');
    this.io = socketIo(server);
    this.connectedSockets = {};

    this.io.on('connection', (socket) => {
      socket.on('connect', (userId) => {
        console.log('new connection', userId);
      });

      socket.on('join', (userId) => {
        console.log('User joined to socket server: ', userId);
        socket.join(userId);
        this.connectedSockets[userId] = socket;
      });

      socket.on('message', (userId, message) => {
        console.log('message came', userId, message);
        socket.to(userId).emit('message', message);
      });

      socket.on('call', (userId, message) => {
        console.log('call socket');
      });

      socket.on('disconnect', (userId) => {
        console.log('user disconnected from socket server: ', userId);
      });
    });
  }


  findConnectedSocketForUser(userId) {
    return this.connectedSockets[userId] || null;
  }


  notifyNewMessage(userId) {
    console.log('User will be notified');

    const connectedSocket = this.findConnectedSocketForUser(userId);

    if (connectedSocket) {
      console.log('user will be notified and found');
      connectedSocket.emit('newMessage', { message: 'You have a new message!' });
    }
  }

  notifyVerificationCode(userId, number, verificationCode) {
    console.log('User will be notified');

    const connectedSocket = this.findConnectedSocketForUser(userId);

    if (connectedSocket) {
      console.log('user will be notified and found');
      connectedSocket.emit('newVerificationCode', { number: number, code: verificationCode });
    }
  }
}


module.exports = new SocketService();
