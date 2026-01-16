import { ProjectileType } from "@shared/types/projectiles/types";
import { Vec3 } from "cannon-es";
import { v4 as uuid } from "uuid";
import { BulletProjectile, DefaultProjectile, Projectile } from "../projectile";
import { Tank } from "src/objects/tank/tank";

export class SpawnProjectileCommand {
  constructor(private projectileType: ProjectileType, private cb: (obj: Projectile) => void) { }

  execute(tank: Tank) {
    const { pos, dir } = this.getSpawnPosition(tank);
    const angle = tank.components.weapon.angle;

    const projectile = new BulletProjectile(uuid(), pos, dir, angle);

    this.cb(projectile);
  }

  private getSpawnPosition(tank: Tank) {
    const euler = new Vec3();
    tank.body.quaternion.toEuler(euler, "YZX");

    const tankY = euler.y;
    const angle = tank.components.weapon.angle + tankY;

    const dir = new Vec3(
      Math.sin(angle),
      0,
      Math.cos(angle)
    ).unit();

    const spawnDistance = 2;

    const pos = new Vec3().copy(tank.body.position);

    pos.x += dir.x * spawnDistance;
    pos.y += 1.3;
    pos.z += dir.z * spawnDistance;

    return { pos, dir };
  }
}
