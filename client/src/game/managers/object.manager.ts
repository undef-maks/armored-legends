import { GameObject } from "../objects/game-object";
import GameManager from "./game.manager";
import { IGameManager } from "./types/game-manager";
import { IObjectManager } from "./types/object-manager";

export class ObjectManager implements IObjectManager {
  objects: Record<string, GameObject> = {};
  gameManager: IGameManager;

  constructor(gameManager: GameManager) {
    this.gameManager = gameManager;
  }

  addObject(gameObject: GameObject): void {
    this.objects[gameObject.id] = gameObject;
  }

  getObjectById(id: string): GameObject | null {
    return this.objects[id] || null;
  }

  getAllObjects() {
    return Object.values(this.objects);
  }

  removeObject(id: string): void {

  }
}
