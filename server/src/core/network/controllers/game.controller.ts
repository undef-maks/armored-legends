import { Socket } from "socket.io";
import { Controller, ControllerMethod, IGameController, Message } from "./controller";
import { GameUpdateResponse, MoveInput } from "@shared/events/game.events";
import { GameService } from "../services/game.service";

export class GameController extends Controller {
  name: "game";

  constructor(private gameService: GameService) {
    super();
    this.methods = {
      "move": this.onMove,
      "weapon-change": this.onWeaponChange
    };
  }

  connect(socket: Socket) {
    this.gameService.handlePlayerJoin(socket);
  }

  private onWeaponChange = (socket: Socket, data: null) => {
    console.log("YEAH")
    this.gameService.changeWeapon(socket.data.player);
  }

  private onMove = (socket: Socket, data: MoveInput) => {
    this.gameService.playerMove(socket.data.player, data);
  }

  private onReady = (socket: Socket) => {
    const player = socket.data.player;
    console.log(player);
    // this.gameService.spawnPlayer(player);
  }

  sendState(playerId: string, state: GameUpdateResponse) {
    const socket = this.gameService.getPlayerSocket(playerId);
    if (!socket) return;
    socket.emit("update", state);
  }
}

