import { GameObjectNetworkState } from "@shared/types/game-objects";
import { GameObject } from "../../objects/game-object";
import { ShadowGenerator } from "@babylonjs/core";

export abstract class ObjectUpdater {
  abstract update(object: GameObject, data: GameObjectNetworkState, shadowGenerator: ShadowGenerator): void;
}
