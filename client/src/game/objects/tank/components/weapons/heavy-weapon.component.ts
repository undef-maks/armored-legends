import { WeaponComponent } from "./weapon.component";

export class HeavyWeaponComponent extends WeaponComponent {
  public modelName: string = "heavy-weapon";
  constructor(id: string) {
    super(id, "heavy-weapon");
  }
}
