import { GameUpdateResponse, MoveInput } from "@shared/events/game.events";
import { Tank } from "../objects/tank/tank";
import { IGameManager } from "./types/game-manager";
import { INetworkManager } from "./types/network-manager";
import { ObjectManager } from "./object.manager";
import { GameClient } from "@network/game-client";
import { SceneManager } from "./scene.manager";
import { NetworkManager } from "./network.manager";
import { UserEventManager } from "./user-event.manager";

class GameManager implements IGameManager {
  ownTank?: Tank;

  private objectManager: ObjectManager;
  private networkManager: INetworkManager;
  private sceneManager: SceneManager;
  private userEventManager: UserEventManager;

  constructor(private client: GameClient) {
    this.objectManager = new ObjectManager(this);
    this.sceneManager = new SceneManager();
    this.networkManager = new NetworkManager(this, client, this.sceneManager);

    this.userEventManager = new UserEventManager(document.getElementById("renderCanvas") as HTMLCanvasElement);

    this.sceneManager.engine.runRenderLoop(() => {
      this.update();
    });

    client.updateSubscribe(this.updateNetworkState);

    this.userEventManager.onKeyDown(e => {
      if (e.key == "q")
        client.sendWeaponChange();
      if (e.key == "e")
        client.sendUseSpell({ type: "shoot" });
    })

    this.userEventManager.onKeyUp(e => {
      if (e.key == "Alt")
        this.sceneManager.camera?.switchControl();
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

    if (!this.sceneManager.camera) return;
    const angle = Math.atan2(this.sceneManager.camera.dx, this.sceneManager.camera.dz);

    const moveInput: MoveInput = {
      horDirection: isPressed("a") ? 1 : isPressed("d") ? -1 : 0,
      verDirection: isPressed("w") ? 1 : isPressed("s") ? -1 : 0,
      angle: angle
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
}

export default GameManager;
