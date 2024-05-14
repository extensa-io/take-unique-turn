import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import path, { dirname } from 'node:path';
import { Server } from 'socket.io';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const server = createServer(app);
const io = new Server(server);

const port = process.env.PORT || '8000';

app.use(express.static(path.join(__dirname, '../../content')));

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(port, () => {
  return console.log(`HttpServer running on ${port}`);
});
