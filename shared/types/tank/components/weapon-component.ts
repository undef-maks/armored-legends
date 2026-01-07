import { ITankComponent } from "./components";
import { WeaponComponentType } from "./types";

export interface ITankWeaponComponent extends ITankComponent {
  readonly type: WeaponComponentType;
  readonly category: "weapon";

  damage: number;
  fireRate: number;
  range: number;
  angle: number;

  getNetworkState: (full: boolean) => WeaponComponentFullNetworkState | WeaponComponentNetworkState;
}

export type WeaponComponentFullNetworkState = Pick<
  ITankWeaponComponent,
  "id" | "type" | "category" | "damage" | "fireRate" | "range" | "angle"
>;

export type WeaponComponentNetworkState = Omit<
  WeaponComponentFullNetworkState,
  "damage" | "fireRate" | "range"
>;
