import { BodyComponentType, TankComponentCategory, TankComponentType, TracksComponentType } from "./types";


export interface ITankComponent {
  readonly category: TankComponentCategory;
  readonly id: string;
  type: TankComponentType;
}



