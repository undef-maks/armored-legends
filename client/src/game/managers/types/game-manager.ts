import { GameUpdateResponse } from "@shared/events/game.events";

export interface IGameManager {
  updateNetworkState(data: GameUpdateResponse): void;
  update(): void;
}
