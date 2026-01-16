import { GameObjectNetworkState } from "@shared/types/game-objects";
import { GameObject } from "../game-object";
import { Quaternion, TransformNode, Vector3 } from "@babylonjs/core";
import { AssetManager } from "@core/asset-manager";
import { ProjectileNetworkState } from "@shared/types/projectiles/projectile";

export class ProjectileObject extends GameObject {
  rootNode?: TransformNode;
  netPos: { position: Vector3, quaternion: Quaternion } | null = null;

  constructor(id: string, private modelName: string) {
    super(id, "projectile");
    this.loadModel();
  }

  private async loadModel() {
    const assetManager = AssetManager.getInstance();
    const model = await assetManager.loadModel(this.modelName + ".glb", "components/projectiles")
    this.rootNode = model;
    this.onModelLoad(model);
    // this.shadowGenerator.addShadowCaster(model.getChildMeshes()[0]);

    this.isLoaded = true;
  }

  onModelLoad(node: TransformNode) {
    if (this.netPos) {
      node.position.set(this.netPos.position.x, this.netPos.position.y, this.netPos.position.z);
    }
  }

  update(dt: number): void {
    if (!this.rootNode) return;
    if (this.netPos == null) return;

    Vector3.LerpToRef(
      this.rootNode.position,
      this.netPos.position,
      0.1,
      this.rootNode.position
    );
  }

  updateNetworkState(state: ProjectileNetworkState): void {
    if (this.netPos == null) {
      this.netPos = {
        quaternion: new Quaternion(),
        position: new Vector3(),
      };
    }

    const { position } = state;
    this.netPos.position.set(position.x, position.y, position.z);
    // this.netPos.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);

  }
}
