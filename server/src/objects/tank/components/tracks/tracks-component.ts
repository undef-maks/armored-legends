import { TracksComponentType } from "@shared/types/tank/components/types";
import { ITankTracksComponent, TracksComponentFullNetworkState, TracksComponentNetworkState } from "@shared/types/tank/components/tracks-component";
import { TankComponent } from "../tank-component";

export class TracksComponent extends TankComponent implements ITankTracksComponent {
  category: "tracks";

  constructor(
    readonly id: string,
    readonly type: TracksComponentType,
    public acceleration: number,
    public maxSpeed: number,
    public turnSpeed: number
  ) {
    super(id, type, "tracks");
  }

  public getNetworkState(full: boolean): TracksComponentFullNetworkState | TracksComponentNetworkState {
    const fullState: TracksComponentFullNetworkState = {
      id: this.id,
      type: this.type,
      category: this.category,
      acceleration: this.acceleration,
      maxSpeed: this.maxSpeed,
      turnSpeed: this.turnSpeed
    };

    if (full) return fullState;

    const { acceleration, maxSpeed, turnSpeed, ...partial } = fullState;
    return partial;
  }

  getStats() {

  }
}

export class MediumTracksComponent extends TracksComponent {
  constructor(id: string) {
    super(id, "medium-tracks", 10, 20, 30);
  }
}

export class ArmoredTracksComponent extends TracksComponent {
  constructor(id: string) {
    super(id, "armored-tracks", 10, 20, 30);
  }
}
