import { GameManager } from "src/core/managers/game-manager";
import PlayerManager from "src/core/managers/player-manager";
import { Socket } from "socket.io";
import { IGameService } from "./service";
import { Player } from "src/core/player";
import { MoveInput, UseSpell } from "@shared/events/game.events";
import { LightWeaponComponent } from "src/objects/tank/components";
import { v4 as uuid } from "uuid";
import { SpawnProjectileCommand } from "src/objects/projectiles/commands/spawn-projectile.command";
import { Projectile } from "src/objects/projectiles/projectile";
import { Vec3 } from "cannon-es";

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

  useSpell(player: Player, data: UseSpell) {
    const tank = this.gameManager.findTankByPlayer(player.id);
    if (!tank) return;

    if (data.type == "shoot") {
      const command = new SpawnProjectileCommand("default", (obj: Projectile) => { this.gameManager.addObject(obj); });
      command.execute(tank);
    }
  }

}

