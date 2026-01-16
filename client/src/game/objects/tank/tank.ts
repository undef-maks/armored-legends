import { GameObject } from "../game-object";
import { TankNetworkState, TankNetworkStateFull } from "@shared/types/tank/tank";
import * as BABYLON from "@babylonjs/core";
import { WeaponComponent } from "./components/weapons/weapon.component";
import { TankBodyComponent } from "./components/bodies/tank-body.component";
import { TracksComponent } from "./components/tracks/tracks.component";
import { Vec3, Vec3Q } from "@shared/types/position";

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

type TankComponents = {
  weapon?: WeaponComponent,
  body?: TankBodyComponent,
  tracks?: TracksComponent
};

export class Tank extends GameObject {
  components: TankComponents = {};
  tankRoot: BABYLON.TransformNode;
  updatedComponentsId: string = "";
  netPos: { position: BABYLON.Vector3, quaternion: BABYLON.Quaternion } | null = null;

  constructor(readonly id: string, scene: BABYLON.Scene, public playerName: string) {
    super(id, "tank");
    this.tankRoot = new BABYLON.TransformNode(`tankRoot-${id}`, scene);
    this.tankRoot.position.set(0, 0, 0);

    console.log(`Spawn tank ${id} name: ${playerName}`);
  }

  update(dt: number): void {
    if (this.components.body?.isLoaded && this.components.tracks?.isLoaded && this.components.weapon?.isLoaded) { }
    else
      return;

    if (this.netPos == null) return;

    BABYLON.Vector3.LerpToRef(
      this.tankRoot.position,
      this.netPos.position,
      0.1,
      this.tankRoot.position
    );

    const body = this.components.body;
    if (!body) return;
    if (!body.rootNode) return;

    if (!body.rootNode.rotationQuaternion)
      body.rootNode.rotationQuaternion = new BABYLON.Quaternion();


    BABYLON.Quaternion.SlerpToRef(
      body.rootNode.rotationQuaternion!,
      this.netPos.quaternion,
      0.15,
      body.rootNode.rotationQuaternion!
    );


    if (this.components.weapon)
      this.components.weapon.update(dt);
  }

  enableShadows(light: BABYLON.Light) {
  }

  updateNetworkState(state: TankNetworkState): void {
    if (this.netPos == null) {
      this.netPos = {
        quaternion: new BABYLON.Quaternion(),
        position: new BABYLON.Vector3(),
      };
    }

    const { position, quaternion } = state;

    this.netPos.position.set(position.x, position.y, position.z);
    this.netPos.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);

    if (this.components.weapon) this.components.weapon.updateNetworkState(state.components.weapons);
  }
}
