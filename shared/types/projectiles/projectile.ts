import { Vec3, Vec3Q } from "../position";
import { ProjectileType } from "./types";

export interface IProjectile {
  readonly id: string;
  type: "projectile";
  category: ProjectileType;
}

export interface ProjectileNetworkState extends IProjectile {
  position: Vec3;
  quaternation: Vec3Q;
}
