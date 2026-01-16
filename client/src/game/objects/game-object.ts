import { GameObjectNetworkState } from "@shared/types/game-objects";

export abstract class GameObject {
  isLoaded: boolean = false;
  constructor(readonly id: string, readonly type: string) { }

  abstract update(dt: number): void;
  abstract updateNetworkState(state: GameObjectNetworkState): void;
}
