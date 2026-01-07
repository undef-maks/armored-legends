import { WeaponComponentType } from "@shared/types/tank/components/types";
import { TankComponent } from "../component";
import { WeaponComponentFullNetworkState, WeaponComponentNetworkState } from "@shared/types/tank/components/weapon-component";
import { Quaternion, TransformNode } from "@babylonjs/core";
import { TankComponentOffsets } from "../bodies/tank-body.component";

export class WeaponComponent extends TankComponent {
  constructor(id: string, type: WeaponComponentType) {
    super(id, type, "weapon");
  }

  changeOffsets(offsets: TankComponentOffsets) {
    this.rootNode.position.copyFrom(offsets.turret);
  }

  onModelLoad(mesh: TransformNode): void {
    mesh.setParent(this.rootNode);
  }

  updateNetworkState(
    data: WeaponComponentNetworkState | WeaponComponentFullNetworkState
  ): void {
    this.rootNode.rotationQuaternion = Quaternion.RotationYawPitchRoll(data.angle, 0, 0);
  }
  update(dt: number): void {
  }
}


