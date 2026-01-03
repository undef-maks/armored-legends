import { GameManager } from "src/core/managers/game-manager";
import PlayerManager from "src/core/managers/player-manager";
import { Socket } from "socket.io";
import { IGameService } from "./service";
import { Player } from "src/core/player";
import { MoveInput } from "@shared/events/game.events";
import { LightWeaponComponent } from "src/objects/tank/components";
import { v4 as uuid } from "uuid";

export class GameService implements IGameService {
  constructor(
    private playerManager: PlayerManager,
    private gameManager: GameManager,
  ) { }

  getPlayerSocket(playerId: string): Socket | undefined {
    return this.playerManager.findPlayer({ id: playerId })?.getSocket();
  }

  handlePlayerJoin(socket: Socket) {
    const player = this.playerManager.findPlayer({ socketId: socket.id })
    this.gameManager.handlePlayerJoin(player);
  }

  playerMove(player: Player, data: MoveInput) {
    const tank = this.gameManager.findTankByPlayer(player.id);
    if (!tank)
      return;

    tank.onMove(data);
  }

  changeWeapon(player: Player) {
    const tank = this.gameManager.findTankByPlayer(player.id);

    if (!tank) return;

    tank.setComponent(new LightWeaponComponent(uuid()));
  }

  spawnPlayer: (player: Player) => void;

  // spawnPlayer: (player: Player) => void;
  // spawnPlayer(player: Player) {
  // this.gameManager.handlePlayerJoin(player);
  // }
  //
  // handlePlayerMove(player: Player, input: MoveInput) {
  //   this.gameManager.updatePlayerInput(player.id, input);
  // }
  //
  // handlePlayerShoot(player: Player, input: ShootInput) {
  //   this.gameManager.playerShoot(player.id, input);
  // }

  // Викликається GameManager кожен network-tick
  // sendStateToPlayer(playerId: string, state: GameUpdateResponse) {
  // this.gameController.sendState(playerId, state);
  // }
}

