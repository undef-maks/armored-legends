import { Mesh, TransformNode } from "@babylonjs/core";
import { TankComponentCategory, TankComponentType } from "@shared/types/tank/components/types";

export abstract class TankComponent {
  public modelName: string = "box";
  public rootNode: TransformNode;
  public parentNode?: TransformNode;
  isLoaded: boolean = false;

  constructor(
    readonly id: string,
    public type: TankComponentType,
    public category: TankComponentCategory
  ) {
    this.rootNode = new TransformNode(`${type}-${id}`);
  }

  abstract onModelLoad(mesh: TransformNode): void;

  public setParent(node: TransformNode) {
    this.parentNode = node;

    this.rootNode?.setParent(node);
  }

  abstract update(dt: number): void;
  abstract updateNetworkState(data: any): void;
}
