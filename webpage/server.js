const { createServer } = require('http');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('input-change', (msg) => {
      console.log('Message:', msg);
      socket.broadcast.emit('update-input', msg);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  server.listen(3000, () => {
    console.log('> Ready on http://localhost:3000');
  });
});
