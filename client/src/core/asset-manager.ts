import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";
export class AssetManager {
  private static _instance: AssetManager;

  private models: Map<string, BABYLON.AssetContainer> = new Map();
  private scene!: BABYLON.Scene;

  private constructor() { }

  static getInstance(): AssetManager {
    if (!this._instance) this._instance = new AssetManager();
    return this._instance;
  }

  initialize(scene: BABYLON.Scene) {
    this.scene = scene;
  }
  //
  // async loadModel(name: string, path: string): Promise<BABYLON.TransformNode> {
  //   if (this.models.has(name)) {
  //     const original = this.models.get(name)!;
  //
  //     const clone = original.clone(`${name}_clone`, null, true)!;
  //     console.log("RETURN CLINE")
  //     return clone;
  //   }
  //   //
  //   const result = await BABYLON.ImportMeshAsync(
  //     `${path}/${name}`,
  //     this.scene
  //   );
  //   const root = new BABYLON.TransformNode("root", this.scene);
  //   result.meshes.forEach(mesh => {
  //     mesh.setParent(root);
  //   })
  //
  //   this.models.set(name, root);
  //
  //   return root;
  // }
  async loadModel(name: string, path: string): Promise<BABYLON.TransformNode> {
    const source = `${path}/${name}`;

    let container = this.models.get(source);
    if (!container) {
      container = await BABYLON.LoadAssetContainerAsync(
        `${path}/${name}`,
        this.scene
      );
      this.models.set(source, container);
    }
    const r = container.instantiateModelsToScene().rootNodes;
    return r[0] as BABYLON.TransformNode;
  }
}

