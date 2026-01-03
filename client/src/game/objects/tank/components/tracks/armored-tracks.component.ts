import { TracksComponentFullNetworkState, TracksComponentNetworkState } from "@shared/types/tank/components/tracks-component";
import { TracksComponent } from "./tracks.component";

export class ArmoredTracksComponent extends TracksComponent {
  public modelName: string = "armored-tracks";
  constructor(id: string) {
    super(id, "armored-tracks");
  }

  update(dt: number): void { }

  updateNetworkState(
    data: TracksComponentNetworkState | TracksComponentFullNetworkState
  ): void { }
}

