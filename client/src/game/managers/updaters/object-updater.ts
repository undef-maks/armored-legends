import { GameObjectNetworkState } from "@shared/types/game-objects";
import { GameObject } from "../../objects/game-object";

export abstract class ObjectUpdater {
  abstract update(object: GameObject, data: GameObjectNetworkState): void;
}
