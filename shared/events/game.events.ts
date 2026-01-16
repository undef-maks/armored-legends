import { ProjectileNetworkState } from "../types/projectiles/projectile";
import { SpellType } from "../types/spells/types";
import { TankNetworkState, TankNetworkStateFull } from "../types/tank/tank";

export interface GameUpdateResponse {
  tanks: TankNetworkState[];
  myTank: TankNetworkStateFull;
  projectiles: ProjectileNetworkState[];
};

export interface MoveInput {
  verDirection: number,
  horDirection: number,
  angle: number
};

export interface UseSpell {
  type: SpellType
};
