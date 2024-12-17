import { Server } from 'socket.io';

export async function GET(req) {
  if (!req.socket.server.io) {
    console.log('Socket is initializing');
    const io = new Server(req.socket.server);
    req.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('Client connected');

      socket.on('input-change', (msg) => {
        socket.broadcast.emit('update-input', msg);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });
  } else {
    console.log('Socket is already running');
  }

  return new Response('Socket initialized', { status: 200 });
}
