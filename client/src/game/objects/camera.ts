import * as BABYLON from "@babylonjs/core";
import { Tank } from "./tank/tank";

export class Camera {
  camera: BABYLON.ArcRotateCamera;
  follower: BABYLON.TransformNode;
  mode: "free" | "default" = "default";
  private initialAlpha: number;
  private initialBeta: number;
  private initialRadius: number;
  dx: number = 0;
  dz: number = 0;
  constructor(private scene: BABYLON.Scene, tank: Tank) {

    this.follower = tank.tankRoot;

    const camera = new BABYLON.ArcRotateCamera(
      "tankCamera",
      Math.PI,
      BABYLON.Tools.ToRadians(30),
      45,
      this.follower.position,
      scene
    );

    this.initialAlpha = camera.alpha;
    this.initialBeta = camera.beta;
    this.initialRadius = camera.radius;

    camera.lowerRadiusLimit = 30;
    camera.upperRadiusLimit = 70;
    camera.panningSensibility = 0;
    this.camera = camera;
  }

  switchControl() {
    this.mode = this.mode == "free" ? "default" : "free";

    if (this.mode == "free") this.free();
    else if (this.mode == "default") this.changeToDefault();
  }

  free() {
    this.camera.attachControl(true);
  }

  changeToDefault() {
    const { camera } = this;

    camera.detachControl();

    camera.lowerRadiusLimit = 30;
    camera.upperRadiusLimit = 70;
    camera.panningSensibility = 0;

    camera.alpha = this.initialAlpha;
    camera.beta = this.initialBeta;
    camera.radius = this.initialRadius;
  }

  update() {
    if (!this.camera) return;
    this.camera.setTarget(this.follower);
    const { scene, follower, camera } = this;

    const ray = scene.createPickingRay(
      scene.pointerX,
      scene.pointerY,
      BABYLON.Matrix.Identity(),
      camera
    );

    // площина Y = 0
    const plane = new BABYLON.Plane(0, 1, 0, 0);
    const distance = ray.intersectsPlane(plane);

    if (distance !== null) {
      const point = ray.origin.add(ray.direction.scale(distance));

      const dx = point.x - follower.position.x;
      const dz = point.z - follower.position.z;


      this.dx = dx;
      this.dz = dz;
    }

  }
}
