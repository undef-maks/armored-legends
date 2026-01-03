import { createServer } from "http";
import { Server } from "socket.io";
import { controllers, createNetwork } from "./core/network/network";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
});

const { gameController } = createNetwork(io);

httpServer.listen(3000);



