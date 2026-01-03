import { GameUpdateResponse } from "@shared/events/game.events";
import { ObjectUpdater } from "../updaters/object-updater";
import { IObjectManager } from "./object-manager";

export interface INetworkManager {
  updaters: Record<string, ObjectUpdater>;

  updateState(data: GameUpdateResponse, objectManager: IObjectManager): void;
}
