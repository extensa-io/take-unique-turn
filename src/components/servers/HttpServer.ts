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
  io.emit(MessageType.TURN_URL, `getTurn/${service.nextAvailableTurn}`);
});

app.post('/getTurn', (req, res) => {
  const id = req.body.id;
  const name = req.body.name || 'anonymous';

  const assignedTurn = assignAndEmit(id, name);

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
  io.emit(MessageType.TURN_URL, `getTurn/${service.nextAvailableTurn}`);

  return assignedTurn;
}
