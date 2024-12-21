
const { createServer } = require('http');
const next = require('next');
const { initServerSocket } = require('./src/socket/socket');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  initServerSocket(server);

  server.listen(3000, () => {
    console.log('> Ready on http://localhost:3000');
  });
});
