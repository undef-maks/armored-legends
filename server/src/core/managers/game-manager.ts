import { PhysicsManager } from "./physics-manager";
import { GameObject } from "../../objects/game-object";
import { Tank } from "../../objects/tank/tank";
import { NetworkManager } from "./network-manager";
import { Player } from "../player";
import { StarterTank } from "../../objects/tank/starter-tank";
import { controllers } from "../network/network";
import { v4 as uuid } from "uuid";

export class GameManager {
  private updateInterval: number = 1000 / 60; // 60 FPS
  private networkInterval: number = 1000 / 20; // 20 FPS
  private networkManager: NetworkManager;

  constructor(private physicsManager: PhysicsManager) {
    this.networkManager = new NetworkManager();
  }

  addObject(object: GameObject) {
    this.physicsManager.add(object);
  }

  removeObject(objectId: string) {
    this.physicsManager.remove(objectId);
  }

  findTankByPlayer(playerId: string) {
    const objects = this.physicsManager.getAll();

    const tanks = objects.filter(obj => obj.type === "tank") as Tank[];

    return tanks.find(tank => tank.playerId === playerId);
  }

  handlePlayerJoin(player: Player) {
    let tank = this.findTankByPlayer(player.id);

    if (!tank) {
      tank = new StarterTank(uuid(), player.id);
      this.physicsManager.add(tank);
    }
  }

  start() {
    setInterval(() => {
      this.physicsManager.update(this.updateInterval / 1000);

      const allObjects = this.physicsManager.getAll();
      const tanks = allObjects.filter(o => o instanceof Tank) as Tank[];
      const objects = allObjects.filter(o => !(o instanceof Tank));

      const updates = this.networkManager.build(tanks, objects);

      for (const { playerId, state } of updates) {
        controllers.game.sendState(playerId, state);
      }
    }, this.updateInterval);
  }
}

