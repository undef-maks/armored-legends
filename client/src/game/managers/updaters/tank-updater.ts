import { ObjectUpdater } from "./object-updater";
import { SetComponentsCommand, verifyComponents } from "../../objects/tank/commands/set-component.command";
import { GameObject } from "../../objects/game-object";
import { GameObjectNetworkState } from "@shared/types/game-objects";
import { Tank } from "../../objects/tank/tank";
import { TankNetworkState, TankNetworkStateFull } from "@shared/types/tank/tank";
import { ShadowGenerator } from "@babylonjs/core";

export class TankUpdater extends ObjectUpdater {
  update(object: GameObject, data: GameObjectNetworkState, shadowGenerator: ShadowGenerator): void {
    const tank = object as Tank;
    const tankData = data as TankNetworkStateFull | TankNetworkState;

    if (data.components.updatedId !== tank.updatedComponentsId) {
      console.log(`Components update for ${tank.id}`);
      new SetComponentsCommand(data.components, shadowGenerator).execute(tank);
    }

    const isLoaded = tank.components.body?.isLoaded && tank.components.weapon?.isLoaded && tank.components.tracks?.isLoaded;

    if (isLoaded)
      object.updateNetworkState(data);
  }
}
