import { TankNetworkState, TankNetworkStateFull } from "../types/tank/tank";

export interface GameUpdateResponse {
  tanks: TankNetworkState[];
  myTank: TankNetworkStateFull;
};

export interface MoveInput {
  verDirection: number,
  horDirection: number,
  angle: number
}
