import { ITankComponent } from "./components";
import { TracksComponentType } from "./types";

export interface ITankTracksComponent extends ITankComponent {
  readonly type: TracksComponentType;
  readonly category: "tracks";

  acceleration: number;
  maxSpeed: number;
  turnSpeed: number;

  getNetworkState: (full: boolean) => TracksComponentFullNetworkState | TracksComponentNetworkState;
}

export type TracksComponentFullNetworkState = Pick<
  ITankTracksComponent,
  "id" | "type" | "category" | "acceleration" | "maxSpeed" | "turnSpeed"
>;

export type TracksComponentNetworkState = Omit<
  TracksComponentFullNetworkState,
  "acceleration" | "maxSpeed" | "turnSpeed"
>;


