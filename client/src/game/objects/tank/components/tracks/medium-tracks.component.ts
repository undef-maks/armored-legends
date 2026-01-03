import { TracksComponentFullNetworkState, TracksComponentNetworkState } from "@shared/types/tank/components/tracks-component";
import { TracksComponent } from "./tracks.component";

export class MediumTracksComponent extends TracksComponent {
  public modelName: string = "medium-tracks";
  constructor(id: string) {
    super(id, "medium-tracks");
  }

  update(dt: number): void { }

  updateNetworkState(
    data: TracksComponentNetworkState | TracksComponentFullNetworkState
  ): void { }
}
