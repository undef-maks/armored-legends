import { TransformNode, Vector3 } from "@babylonjs/core";
import { DecorationObject } from "./decoration-object";

export class SmallStone extends DecorationObject {
  constructor(private spawnPos: Vector3) {
    super("small-stone");
  }

  onModelLoad(model: TransformNode): void {
    model.position = this.spawnPos;
  }
}
