import { Vec3, Vec3Q } from "../position";
import { BodyComponentFullNetworkState, BodyComponentNetworkState } from "./components/body-component";
import { TracksComponentFullNetworkState, TracksComponentNetworkState } from "./components/tracks-component";
import { WeaponComponentFullNetworkState, WeaponComponentNetworkState } from "./components/weapon-component";

export interface ITank {
  readonly id: string;
  readonly playerId: string;
  type: string;
  getNetworkState: (full: boolean) => TankNetworkStateFull | TankNetworkState;
}


export interface TankComponentsNetworkStateFull {
  body: BodyComponentFullNetworkState;
  tracks: TracksComponentFullNetworkState;
  weapons: WeaponComponentFullNetworkState;

  updatedId: string;
}

export interface TankComponentsNetworkState {
  body: BodyComponentNetworkState;
  tracks: TracksComponentNetworkState;
  weapons: WeaponComponentNetworkState;

  updatedId: string;
}

export interface TankNetworkState {
  type: "tank";
  id: string;
  playerId: string;
  position: Vec3;
  quaternion: Vec3Q;
  components: TankComponentsNetworkState;
}

export interface TankNetworkStateFull {
  type: "tank";
  id: string;
  playerId: string;
  position: Vec3;
  quaternion: Vec3Q;
  components: TankComponentsNetworkStateFull;
}

