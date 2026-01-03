import { GameObject } from "src/objects/game-object";
import { Tank } from "src/objects/tank/tank";
import { GameUpdateResponse } from "@shared/events/game.events";
import { TankNetworkStateFull } from "@shared/types/tank/tank";

export class NetworkManager {
  build(
    tanks: Tank[],
    objects: GameObject[]
  ): { playerId: string; state: GameUpdateResponse }[] {
    const response = [];

    for (const playerTank of tanks) {
      const state: GameUpdateResponse = {
        tanks: [],
        myTank: playerTank.getNetworkState(true) as TankNetworkStateFull
      };

      for (const mapTank of tanks) {
        if (mapTank.id === playerTank.id) continue;
        state.tanks.push(mapTank.getNetworkState(false));
      }

      response.push({ playerId: playerTank.playerId, state });
    }

    return response;
  }
}

