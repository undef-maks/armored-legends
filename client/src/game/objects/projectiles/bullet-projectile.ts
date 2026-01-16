import { ProjectileObject } from "./projectile-object";

export class BulletProjectile extends ProjectileObject {
  constructor(id: string) {
    super(id, "bullet-projectile");
  }
}
