import express from 'express';

import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import path, { dirname } from 'node:path';
import { Server } from 'socket.io';

import {TurnService} from '../../shared/services/TurnService';
import {MessageType} from '../../shared/Types';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const server = createServer(app);
const io = new Server(server);

const service = new TurnService();

const port = process.env.PORT || '8000';

app.use(express.static(path.join(__dirname, '../../content')));

io.on('connection', (socket) => {
  io.emit(MessageType.TURN_URL, `${service.nextAvailableTurn}`);
});

app.post('/getTurn/:id', (req, res) => {
  const id = req.params.id;
  const userName = req.body && req.body.user_name ? req.body.user_name : 'anonymous';
  console.log(userName);
  console.log(id);

  const assignedTurn = assignAndEmit(id, userName);

  res.send(`<h1>${assignedTurn}</h1>`);
});

app.get('/getTurn/:id', (req, res) => {
  const assignedTurn = assignAndEmit(req.params.id, 'anonymous');
  res.send(`<h1>${assignedTurn}</h1>`);
});

server.listen(port, () => {
  return console.log(`Server running on ${port}`);
});

function assignAndEmit(id: string, name: string): number {
  const assignedTurn = service.assignTurn(id, name);
  io.emit(MessageType.TURN_URL, `${service.nextAvailableTurn}`);

  return assignedTurn;
}
