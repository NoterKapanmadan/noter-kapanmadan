
const { Server } = require('socket.io');
function initServerSocket(server) {
    const io = new Server(server);

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('input-change', (msg) => {
      console.log('Message: ' + msg);
      io.emit('update-input', msg);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
}

module.exports = { initServerSocket };