import { ProjectileObject } from "./projectile-object";

export class DefaultProjectile extends ProjectileObject {
  constructor(id: string) {
    super(id, "default-projectile");
  }
}
