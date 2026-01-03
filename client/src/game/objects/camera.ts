import * as BABYLON from "@babylonjs/core";
import { Tank } from "./tank/tank";

export class Camera {
  camera: BABYLON.ArcRotateCamera;
  follower: BABYLON.TransformNode;

  constructor(scene: BABYLON.Scene, tank: Tank) {

    this.follower = tank.tankRoot;

    const camera = new BABYLON.ArcRotateCamera(
      "tankCamera",
      Math.PI,          // горизонтальний кут (повернення камери)
      BABYLON.Tools.ToRadians(30), // вертикальний кут (наскільки зверху)
      45,               // відстань від танка
      this.follower.position,
      scene
    );

    camera.lowerRadiusLimit = 30;
    camera.upperRadiusLimit = 70;
    camera.panningSensibility = 0;
    camera.attachControl(true);
    this.camera = camera;

  }

  update() {
    this.camera.setTarget(this.follower);
  }
}
