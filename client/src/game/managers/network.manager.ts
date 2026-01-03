import { GameUpdateResponse, MoveInput } from "@shared/events/game.events";
import { INetworkManager } from "./types/network-manager";
import { ObjectUpdater } from "./updaters/object-updater";
import { IObjectManager } from "./types/object-manager";
import { Tank } from "../objects/tank/tank";
import { TankUpdater } from "./updaters/tank-updater";
import { GameClient } from "../../network/game-client";
import GameManager from "./game.manager";

export class NetworkManager implements INetworkManager {
  updaters: Record<string, ObjectUpdater> = {
    "tank": new TankUpdater()
  };

  constructor(private gameManager: GameManager, private client: GameClient) { }

  updateState(data: GameUpdateResponse, objectManager: IObjectManager): void {
    this.initMyTank(data, objectManager);

    const scene = this.gameManager.getScene("main");
    if (!scene) return;
    for (let tankData of data.tanks) {
      let tank = objectManager.getObjectById(tankData.id);
      if (!tank) {
        tank = new Tank(tankData.id, scene);
        objectManager.addObject(tank);
      }
      this.updaters["tank"].update(tank, tankData);
    }
  }

  private initMyTank(data: GameUpdateResponse, objectManager: IObjectManager) {
    const promiseTank = objectManager.getObjectById(data.myTank.id);

    const scene = this.gameManager.getScene("main");

    if (!scene)
      return;

    if (!promiseTank) {
      const newObject = new Tank(data.myTank.id, scene);
      objectManager.addObject(newObject);
      this.gameManager.registerOwnTank(newObject);
      this.updaters["tank"].update(newObject, data.myTank);
    } else {
      this.updaters["tank"].update(promiseTank, data.myTank);
    }
  }
}
