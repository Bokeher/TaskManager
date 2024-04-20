const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 4000;

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('someEvent', () => {
    console.log('Received someEvent from client');

    // Informuj klienta o zmianie danych
    io.to(socket.id).emit('dataChange');
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});