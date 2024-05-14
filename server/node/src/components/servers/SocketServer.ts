import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const port = process.env.SOCKET_PORT || '8000';

const io = new Server(httpServer, { /* options */ });

io.on("connection", (socket) => {
  // ...
});

httpServer.listen(port, () => {
  return console.log(`SocketServer running on ${port}`);
});
