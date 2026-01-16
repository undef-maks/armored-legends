import { GameUpdateResponse, MoveInput } from "@shared/events/game.events";
import { INetworkManager } from "./types/network-manager";
import { ObjectUpdater } from "./updaters/object-updater";
import { IObjectManager } from "./types/object-manager";
import { Tank } from "../objects/tank/tank";
import { TankUpdater } from "./updaters/tank-updater";
import { GameClient } from "../../network/game-client";
import GameManager from "./game.manager";
import { SceneManager } from "./scene.manager";
import { SmallStone } from "@game/objects/decorations/small-stone";
import { GameObject } from "@game/objects/game-object";
import { ProjectileUpdater } from "./updaters/projectile-updater";
import { DefaultProjectile } from "@game/objects/projectiles/default-projectile";
import { BulletProjectile } from "@game/objects/projectiles/bullet-projectile";

export class NetworkManager implements INetworkManager {
  updaters: Record<string, ObjectUpdater> = {
    "tank": new TankUpdater(),
    "projectile": new ProjectileUpdater()
  };

  constructor(private gameManager: GameManager, private client: GameClient, private sceneManager: SceneManager) { }

  public updateState(data: GameUpdateResponse, objectManager: IObjectManager): void {
    this.initMyTank(data, objectManager);

    const scene = this.gameManager.getScene("main");
    if (!scene) return;
    for (let tankData of data.tanks) {
      let tank: GameObject | null = objectManager.getObjectById(tankData.id);
      if (!tank) {
        tank = new Tank(tankData.id, scene, tankData.playerName);
        objectManager.addObject(tank);
      }
      if (this.sceneManager.shadowGenerator)
        this.updaters["tank"].update(tank, tankData, this.sceneManager.shadowGenerator);
    }

    for (let projectileData of data.projectiles) {
      let projectile = objectManager.getObjectById(projectileData.id);
      if (!projectile) {
        switch (projectileData.category) {
          case "bullet": projectile = new BulletProjectile(projectileData.id); break;
          case "default": projectile = new DefaultProjectile(projectileData.id); break;
        }
        objectManager.addObject(projectile);
      }

      if (this.sceneManager.shadowGenerator)
        this.updaters["projectile"].update(projectile, projectileData, this.sceneManager.shadowGenerator);
    }
  }

  private initMyTank(data: GameUpdateResponse, objectManager: IObjectManager) {
    const promiseTank = objectManager.getObjectById(data.myTank.id);

    const scene = this.gameManager.getScene("main");

    if (!scene)
      return;
    if (!this.sceneManager.shadowGenerator) return;

    if (!promiseTank) {
      const newObject = new Tank(data.myTank.id, scene, data.myTank.playerName);
      objectManager.addObject(newObject);
      this.gameManager.registerOwnTank(newObject);
      this.updaters["tank"].update(newObject, data.myTank, this.sceneManager.shadowGenerator);
    } else {
      this.updaters["tank"].update(promiseTank, data.myTank, this.sceneManager.shadowGenerator);
    }
  }
}
