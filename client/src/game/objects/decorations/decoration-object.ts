import { TransformNode } from "@babylonjs/core";
import { AssetManager } from "@core/asset-manager";
import { GameObject } from "@game/objects/game-object";
import { GameObjectNetworkState } from "@shared/types/game-objects";

export class DecorationObject extends GameObject {
  rootNode?: TransformNode;

  constructor(private modelName: string) {
    super("jst-id", "rock");
    this.loadModel();
  }

  private async loadModel() {
    const assetManager = AssetManager.getInstance();
    const model = await assetManager.loadModel(this.modelName + ".glb", "components/decorations")
    this.rootNode = model;
    this.onModelLoad(model);
    // this.shadowGenerator.addShadowCaster(model.getChildMeshes()[0]);

    this.isLoaded = true;
  }

  update(dt: number): void {

  }

  updateNetworkState<T extends GameObjectNetworkState>(state: T): void {

  }

  onModelLoad(model: TransformNode) {

  }
}
