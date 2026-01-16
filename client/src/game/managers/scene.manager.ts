import { Engine, HemisphericLight, Scene, Vector3 } from "@babylonjs/core";
import { ISceneManager } from "./types/scene-manager";
import * as BABYLON from "@babylonjs/core";
import { Camera } from "../objects/camera";
import { AssetManager } from "../../core/asset-manager";
import { Tank } from "@game/objects/tank/tank";
import { SmallStone } from "@game/objects/decorations/small-stone";


function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  // The formula ensures min is possible, but max is not (e.g., 0 to 9)
  return Math.floor(Math.random() * (max - min)) + min;
}
export class SceneManager implements ISceneManager {
  scenes: Record<string, Scene> = {};
  engine: Engine;
  camera?: Camera;
  shadowGenerator: BABYLON.ShadowGenerator | null = null;

  constructor() {
    const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
    this.engine = new Engine(canvas, false, { preserveDrawingBuffer: true, stencil: true });
    this.scenes["main"] = this.createScene();

    canvas.style = "display: block";
    this.engine.resize();
    window.addEventListener('resize', () => {
      this.engine.resize();
    });

    const assetManager = AssetManager.getInstance();
    assetManager.initialize(this.scenes["main"]);
    this.spawnDecorations();
  }

  createCamera(follower: Tank) {
    this.camera = new Camera(this.scenes["main"], follower);
  }

  createScene() {
    const scene = new Scene(this.engine);
    var light = new BABYLON.DirectionalLight('light1', new Vector3(-40, -4000, -10), scene);

    light.position = new BABYLON.Vector3(10000, 0, 1000);
    light.intensity = 1.6;

    this.shadowGenerator = new BABYLON.ShadowGenerator(1024, light);

    this.makeGround(scene);
    return scene;
  }

  spawnDecorations() {
    for (let i = 0; i < 150; i++) {
      const pos = new Vector3(getRandomInt(-500, 500), 0.1, getRandomInt(-500, 500));
      const s = new SmallStone(pos);
    }
  }

  makeGround(scene: Scene) {
    const ground = BABYLON.MeshBuilder.CreateTiledGround("tiled-ground", {
      xmin: -1000, xmax: 1000, zmin: -1000, zmax: 1000, subdivisions: { w: 500, h: 500 }, updatable: true
    }, scene);

    const mat = new BABYLON.StandardMaterial("mat", scene);
    const tex = new BABYLON.Texture("./tiles.png", scene);
    tex.updateSamplingMode(BABYLON.Texture.NEAREST_SAMPLINGMODE);
    tex.anisotropicFilteringLevel = 1;


    mat.diffuseTexture = tex;
    mat.specularColor = new BABYLON.Color3(0, 0, 0)
    ground.material = mat;

    tex.uOffset = 0;
    const positions = ground.getVerticesData(BABYLON.VertexBuffer.PositionKind) as any;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] += Math.sin(positions[i] * 0) * 0.1 + Math.cos(positions[i + 2] * 0) * 0.1;
    }
    // console.log(positions, )
    ground.updateVerticesData(BABYLON.VertexBuffer.PositionKind, positions);
    ground.updateVerticesData(
      BABYLON.VertexBuffer.PositionKind,
      positions,
      true
    );
    ground.receiveShadows = true;
    ground.refreshBoundingInfo();
    tex.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
    tex.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;
  }


  update(): void {
    this.scenes["main"].render();
    this.camera?.update();
  }

  getScene(name: string): Scene | null {
    return this.scenes[name] || null;
  }
}
