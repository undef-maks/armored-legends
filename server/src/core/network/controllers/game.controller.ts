import { Socket } from "socket.io";
import { Controller, ControllerMethod, IGameController, Message } from "./controller";
import { GameUpdateResponse, MoveInput, UseSpell } from "@shared/events/game.events";
import { GameService } from "../services/game.service";

export class GameController extends Controller {
  name: "game";

  constructor(private gameService: GameService) {
    super();
    this.methods = {
      "move": this.onMove,
      "weapon-change": this.onWeaponChange,
      "use-spell": this.onUseSpell
    };
  }

  connect(socket: Socket) {
    this.gameService.handlePlayerJoin(socket);
  }

  private onUseSpell = (socket: Socket, data: UseSpell) => {
    this.gameService.useSpell(socket.data.player, data);
  }

  private onWeaponChange = (socket: Socket, data: null) => {
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

