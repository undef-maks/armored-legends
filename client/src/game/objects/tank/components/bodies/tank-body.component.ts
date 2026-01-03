import { BodyComponentType } from "@shared/types/tank/components/types";
import { TankComponent } from "../component";
import { Mesh, TransformNode, Vector3 } from "@babylonjs/core";

export type TankComponentOffsets = {
  turret: Vector3,
  tracks: { left: Vector3, right: Vector3 }
};

export class TankBodyComponent extends TankComponent {
  offsets: TankComponentOffsets = {
    tracks: { left: new Vector3(-1.3, 0, 0), right: new Vector3(+1.4, 0, 0) },
    turret: new Vector3(0, 1, 0.6)
  };

  constructor(id: string, type: BodyComponentType) {
    super(id, type, "body");
  }

  onModelLoad(mesh: TransformNode): void {
    mesh.setParent(this.rootNode);
    this.rootNode.position.copyFrom(new Vector3(0, 0, 0));
  }
  updateNetworkState(data: any): void { }

  update(dt: number): void { }
}
