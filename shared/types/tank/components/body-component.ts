import { ITankComponent } from "./components";
import { BodyComponentType } from "./types";

export interface ITankBodyComponent extends ITankComponent {
  readonly type: BodyComponentType,
  readonly category: "body";
  mass: number;
  armor: number;
  maxHealth: number;
  getNetworkState: (full: boolean) => BodyComponentFullNetworkState | BodyComponentNetworkState;
}
export type BodyComponentFullNetworkState = Pick<ITankBodyComponent, "id" | "type" | "mass" | "armor" | "maxHealth" | "category">;
export type BodyComponentNetworkState = Omit<BodyComponentFullNetworkState, "mass" | "armor">;
