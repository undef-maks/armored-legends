import { GameObject } from "../../../game/objects/game-object";

export interface IObjectManager {
  objects: Record<string, GameObject>;

  addObject(gameObject: GameObject): void;
  removeObject(id: string): void;
  getObjectById(id: string): GameObject | null;
}

