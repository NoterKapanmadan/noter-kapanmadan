import 'dotenv/config';
import express from 'express';
import http from 'http';
import { initServerSocket } from './src/socket.js';


// Create an Express app
const app = express();

// Create an HTTP server
const server = http.createServer(app);

// Attach Socket.IO to the HTTP server


// Serve a simple route
app.get('/', (req, res) => {
    res.send('Socket server is running');

});

console.log(process.env.DB_USERNAME);

initServerSocket(server);

// Start the server
const PORT = process.env.PORT || 8654;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
