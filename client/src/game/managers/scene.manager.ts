import { Engine, HemisphericLight, Scene, Vector3 } from "@babylonjs/core";
import { ISceneManager } from "./types/scene-manager";
import * as BABYLON from "@babylonjs/core";
import { Camera } from "../objects/camera";
import { AssetManager } from "../../core/asset-manager";
import { Tank } from "@game/objects/tank/tank";

export class SceneManager implements ISceneManager {
  scenes: Record<string, Scene> = {};
  engine: Engine;
  camera?: Camera;

  constructor() {
    const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
    this.engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
    this.scenes["main"] = this.createScene();

    canvas.style = "display: block";
    this.engine.resize();
    window.addEventListener('resize', () => {
      this.engine.resize();
    });

    const assetManager = AssetManager.getInstance();
    assetManager.initialize(this.scenes["main"]);
  }

  createCamera(follower: Tank) {
    this.camera = new Camera(this.scenes["main"], follower);
  }

  createScene() {
    const scene = new Scene(this.engine);
    var light = new HemisphericLight('light1', new Vector3(0, 1, 0), scene);
    const plane = BABYLON.MeshBuilder.CreatePlane(
      "plane",
      { width: 40, height: 40 },
      scene
    );
    plane.position.y = 0.2;
    plane.rotation.x = Math.PI / 2;
    return scene;
  }

  update(): void {
    this.scenes["main"].render();
    this.camera?.update();
  }

  getScene(name: string): Scene | null {
    return this.scenes[name] || null;
  }
}
