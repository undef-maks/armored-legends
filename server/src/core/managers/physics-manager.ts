import { Body, NaiveBroadphase, Plane, World } from "cannon-es";
import { GameObject } from "src/objects/game-object";

export interface IPhysicsManager {
  update(delta: number): void;
  add(object: GameObject): void;
  remove(objectId: string): void;
  getAll(): GameObject[];
}

export class PhysicsManager implements IPhysicsManager {
  private objects: Record<string, GameObject> = {};
  world: World;

  constructor() {
    this.world = new World();

    this.world.gravity.set(0, -9.82, 0);
    this.world.broadphase = new NaiveBroadphase();
    const groundBody = new Body({
      shape: new Plane(),
      type: Body.STATIC
    });
    this.world.defaultContactMaterial.friction = 0.001;

    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    this.world.addBody(groundBody);
  }
  add(object: GameObject) {
    this.objects[object.id] = object;
    this.world.addBody(object.body);
  }

  remove(objectId: string) {
    delete this.objects[objectId];
  }

  getAll(): GameObject[] {
    return Object.values(this.objects);
  }

  update(delta: number) {
    const timeStep = 1 / 60;
    const maxSubSteps = 10; // Дозволяємо рушію зробити до 10 мікро-кроків, якщо треба
    const deltaTime = 0.016;
    // У вашому ігровому циклі (requestAnimationFrame):
    this.world.step(timeStep, deltaTime, maxSubSteps);
    for (const obj of this.getAll()) {
      obj.update();
    }
  }
}

