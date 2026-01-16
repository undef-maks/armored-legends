import { ShadowGenerator } from "@babylonjs/core";
import { GameObject } from "@game/objects/game-object";
import { GameObjectNetworkState } from "@shared/types/game-objects";
import { ObjectUpdater } from "./object-updater";
import { ProjectileNetworkState } from "@shared/types/projectiles/projectile";

export class ProjectileUpdater extends ObjectUpdater {
  update(object: GameObject, data: GameObjectNetworkState, shadowGenerator: ShadowGenerator): void {
    const projectileData = data as ProjectileNetworkState;

    object.updateNetworkState(projectileData);
  }
}

