import { Body, Quaternion, Sphere, Vec3 } from "cannon-es";
import { GameObject } from "../game-object";
import { ProjectileType } from "@shared/types/projectiles/types";
import { ProjectileNetworkState } from "@shared/types/projectiles/projectile";

export class Projectile extends GameObject {
  constructor(id: string, body: Body, public category: ProjectileType, public dir: Vec3, damage: number, force: number, angle: number) {
    super(id, body, "projectile");

    body.velocity.set(
      dir.x * force,
      dir.y * force,
      dir.z * force
    );

    const quaternion = new Quaternion();
    const ay = angle;
    quaternion.setFromEuler(0, ay, 0);
  }

  update(): void {

  }

  getNetworkState(full?: boolean): ProjectileNetworkState {
    return {
      type: "projectile",
      category: this.category,
      id: this.id,
      position: this.body.position,
      quaternation: this.body.quaternion
    }
  }
}

export class DefaultProjectile extends Projectile {
  constructor(id: string, position: Vec3, dir: Vec3, angle: number) {
    const projectileShape = new Sphere(0.25);

    const body = new Body({
      mass: 1,
      shape: projectileShape,
      position: new Vec3(position.x, position.y, position.z),
    });

    super(id, body, "default", dir, 10, 70, angle);
  }
}

export class BulletProjectile extends Projectile {
  constructor(id: string, position: Vec3, dir: Vec3, angle: number) {
    const projectileShape = new Sphere(0.15);

    const body = new Body({
      mass: 1,
      shape: projectileShape,
      position: new Vec3(position.x, position.y, position.z)
    });

    super(id, body, "bullet", dir, 2, 100, angle);
  }
}

