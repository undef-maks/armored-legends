import { io } from "socket.io-client";
import { GameClient } from "../network/game-client";
import GameManager from "@game/managers/game.manager";

export class GameLoader {
  static load() {
    console.log("Підгружаємо гру...");

    const gameClient = new GameClient();
    const token = localStorage.getItem("token");
    if (token) gameClient.build(token);

    const gameManager = new GameManager(gameClient);
  }
}

