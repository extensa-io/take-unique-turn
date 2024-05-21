import express from 'express';
import * as dotenv from 'dotenv'

import { createServer } from 'node:http';
import path from 'node:path';
import { Server } from 'socket.io';

import { TurnRepository } from '../../shared/repositories/TurnRepository';
import { DBSettings, Message, MessageType } from '../../shared/Types';
import { TurnService } from '../../shared/services/TurnService';

dotenv.config()

void (async () => {
  // env variables
  const port =  process.env.PORT || '8000';
  const serverURL = process.env.SERVER_URL || '/';
  const dbSettings: DBSettings = {
    dbCollection: process.env.MONGO_DB_COLLECTION || '',
    dbServer: process.env.MONGO_DB_SERVER_URL || '',
    dbUser: process.env.MONGO_DB_USER || '',
    dbPassword: process.env.MONGO_DB_PASSWORD || '',
  }

  // components
  const repository = new TurnRepository();
  await repository.connect(dbSettings);
  const service = new TurnService(repository);
  await service.createNextTurn();

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

  app.get('/all', async (req, res) => {
    res.status(200).send(await service.getTurns());
  });

  app.get('/getTurn/:id', async (req, res) => {
    const userName = 'anonymous';
    const turnId = req.params.id;
    const assignedTurn = await service.assignTurn(turnId, userName);

    res.redirect(`/thanks.html?name=${assignedTurn.user_name}&turn=${assignedTurn.turn}`);
  });

  app.post('/getTurn/:id', async (req, res) => {
    const turnId = req.params.id;
    const userName = req.body && req.body.user_name ? req.body.user_name : 'anonymous';

    const assignedTurn = await service.assignTurn(turnId, userName);

    res.redirect(`/thanks.html?name=${assignedTurn.user_name}&turn=${assignedTurn.turn}`);
  });

  app.post('/reset', async (req, res) => {
    await service.resetDB();
    await createAndEmit();

    res.send(`<h1>turns cleared, next turn is [${service.nextAvailableTurn}]</h1`);
  });

  app.get('/assign/:id', async (req, res) => {
    const turnID = req.params.id;
    await service.reserveTurn(turnID)
    await createAndEmit();
    res.redirect(`/assign.html?id=${turnID}`);
  });

  // miscellaneous
  async function createAndEmit(): Promise<void> {
    await service.createNextTurn();

    const message = buildMessage();
    console.log(`emitting message for turn [${message.next_available_turn}]`);

    io.emit(MessageType.TURN_URL, message);
  }

  function buildMessage(): Message {
    return {
      server_url: serverURL,
      next_available_turn: service.nextAvailableTurn,
    };
  }
})();
