import { ProjectileNetworkState } from "./projectiles/projectile";
import { TankNetworkState } from "./tank/tank";

export type GameObjectNetworkState = TankNetworkState | ProjectileNetworkState;
