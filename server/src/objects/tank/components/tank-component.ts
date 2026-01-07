import { ITankComponent } from "@shared/types/tank/components/components";
import { Ability } from "../abilities/ability";
import { TankComponentType, TankComponentCategory } from "@shared/types/tank/components/types";

export abstract class TankComponent implements ITankComponent {
  abilities: Ability[];

  constructor(
    readonly id: string,
    readonly type: TankComponentType,
    readonly category: TankComponentCategory
  ) { }

  abstract update(): any;
  abstract getStats(): any;
}





