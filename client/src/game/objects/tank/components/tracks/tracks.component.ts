import { TracksComponentType } from "@shared/types/tank/components/types";
import { TankComponent } from "../component";
import { TracksComponentFullNetworkState, TracksComponentNetworkState } from "@shared/types/tank/components/tracks-component";
import { AbstractMesh, Mesh, TransformNode } from "@babylonjs/core";
import { TankComponentOffsets } from "../bodies/tank-body.component";

export class TracksComponent extends TankComponent {
  leftTrackNode: TransformNode;
  rightTrackNode: TransformNode;

  constructor(id: string, type: TracksComponentType) {
    super(id, type, "tracks");

    this.leftTrackNode = new TransformNode(`left-${id}-${type}`);
    this.rightTrackNode = new TransformNode(`right-${id}-${type}`);

    this.leftTrackNode.setParent(this.rootNode);
    this.rightTrackNode.setParent(this.rootNode);
  }

  changeOffsets(offsets: TankComponentOffsets) {
    const { left, right } = offsets.tracks;
    this.leftTrackNode.position.copyFrom(left);
    this.rightTrackNode.position.copyFrom(right);
  }

  update(dt: number): void { }

  onModelLoad(mesh: TransformNode): void {
    mesh.clone(`right-track-${this.id}`, this.rightTrackNode);
    mesh.setParent(this.leftTrackNode);
  }

  updateNetworkState(
    data: TracksComponentNetworkState | TracksComponentFullNetworkState
  ): void { }
}


