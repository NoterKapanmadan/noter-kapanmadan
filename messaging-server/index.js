const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { initServerSocket } = require('./src/socket');

// Create an Express app
const app = express();

// Create an HTTP server
const server = http.createServer(app);

// Attach Socket.IO to the HTTP server


// Serve a simple route
app.get('/', (req, res) => {
    res.send('Socket server is running');
});


initServerSocket(server);

// Start the server
const PORT = process.env.PORT || 8654;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
