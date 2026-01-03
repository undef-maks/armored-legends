import { GameObject } from "../objects/game-object";
import { GameUpdateResponse, MoveInput } from "@shared/events/game.events";
import { Tank } from "../objects/tank/tank";
import { ObjectUpdater } from "./updaters/object-updater";
import { TankUpdater } from "./updaters/tank-updater";
import * as BABYLON from "@babylonjs/core";
import { IGameManager } from "./types/game-manager";
import { INetworkManager } from "./types/network-manager";
import { ObjectManager } from "./object.manager";
import { GameClient } from "@network/game-client";
import { SceneManager } from "./scene.manager";
import { NetworkManager } from "./network.manager";
import { UserEventManager } from "./user-event.manager";

class GameManager implements IGameManager {
  objects: Record<string, GameObject> = {};
  updaters: Record<string, ObjectUpdater> = {
    tank: new TankUpdater()
  };
  ownTank?: Tank;

  private objectManager: ObjectManager;
  private networkManager: INetworkManager;
  private sceneManager: SceneManager;
  private userEventManager: UserEventManager;

  constructor(private client: GameClient) {
    this.objectManager = new ObjectManager(this);
    this.networkManager = new NetworkManager(this, client);
    this.sceneManager = new SceneManager();
    this.userEventManager = new UserEventManager(document.getElementById("renderCanvas") as HTMLCanvasElement);

    this.sceneManager.engine.runRenderLoop(() => {
      this.update();
    });

    client.updateSubscribe(this.updateNetworkState);

    this.userEventManager.onKeyDown(e => {
      if (e.key == "q")
        client.sendWeaponChange();
    })
  }

  registerOwnTank = (tank: Tank) => {
    this.ownTank = tank;
    this.sceneManager.createCamera(tank);
  }

  update(): void {
    const obj = this.objectManager.getAllObjects();
    for (let object of obj)
      object.update(1);

    if (this.ownTank)
      this.sceneManager.update();

    const { isPressed } = this.userEventManager;

    const moveInput: MoveInput = {
      horDirection: isPressed("a") ? 1 : isPressed("d") ? -1 : 0,
      verDirection: isPressed("w") ? 1 : isPressed("s") ? -1 : 0
    };

    this.client.sendMove(moveInput);
  }

  getObjectById(id: string) {
    return this.objectManager.objects[id];
  }

  getScene(name: string) {
    return this.sceneManager.getScene(name);
  }

  updateNetworkState = (data: GameUpdateResponse) => {
    this.networkManager.updateState(data, this.objectManager);
  }

  public createObjectFromData(data: any, scene: BABYLON.Scene): GameObject | null {
    switch (data.type) {
      case "tank": return new Tank(data.id, scene);
      default: return null;
    }
  }
}

export default GameManager;
