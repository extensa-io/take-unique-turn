import express from 'express';

import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import path, { dirname } from 'node:path';
import { Server } from 'socket.io';

import {TurnService} from '../../shared/services/TurnService';
import {Message, MessageType} from '../../shared/Types';

const __dirname = dirname(fileURLToPath(import.meta.url));

// env variables
const port =  process.env.PORT || '8000';
const serverURL = process.env.SERVER_URL || '/';
const dbCollection = process.env.MONGO_DB_COLLECTION || '';
const dbServer = process.env.MONGO_DB_SERVER_URL || '';
const dbUser = process.env.MONGO_DB_USER || '';
const dbPassword = process.env.MONGO_DB_PASSWORD || '';

console.log(`port:${port}, serverURL:${serverURL}, dbCollection:${dbCollection}, dbServer:${dbServer}, dbUser:${dbUser}, dbPassword:${dbPassword}`);

// components
const service = new TurnService();

// server
const app = express();
const server = createServer(app);

server.listen(port, () => {
  return console.log(`Server running on ${port}`);
});

//socket
const io = new Server(server);

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../../content')));

// socket listener
io.on('connection', (socket) => {
  io.emit(MessageType.TURN_URL, buildMessage());
});

// routes
app.get('/', (req, res) => {
  res.status(200).send('take-unique-api API OK')
});

app.get('/getTurn/:id', (req, res) => {
  const userName = 'anonymous';
  const assignedTurn = service.assignTurn(req.params.id, userName);

  res.redirect(`/thanks.html?name=${userName}&turn=${assignedTurn}`);
});

app.post('/getTurn/:id', async (req, res) => {
  const id = req.params.id;
  const userName = req.body && req.body.user_name ? req.body.user_name : 'anonymous';

  const assignedTurn = service.assignTurn(id, userName);

  res.redirect(`/thanks.html?name=${userName}&turn=${assignedTurn}`);
});

app.get('/assign/:id', (req, res) => {
  createAndEmit();
  res.redirect(`/assign.html?id=${req.params.id}`);
});

// miscellaneous
function createAndEmit(): void {
  service.createNextTurn();
  io.emit(MessageType.TURN_URL, buildMessage());
}

function buildMessage(): Message {
  return {
    server_url: serverURL,
    next_available_turn: service.nextAvailableTurn,
  };
}
