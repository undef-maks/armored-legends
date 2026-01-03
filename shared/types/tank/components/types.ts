export type TankComponentType =
  | WeaponComponentType
  | BodyComponentType
  | TracksComponentType;

export type WeaponComponentType =
  | "heavy-weapon"
  | "medium-weapon"
  | "light-weapon"
  | "flame-weapon";

export type TracksComponentType =
  | "medium-tracks"
  | "armored-tracks"

export type BodyComponentType =
  | "light-body"
  | "heavy-body"

export type TankComponentCategory = "body" | "tracks" | "weapon";

