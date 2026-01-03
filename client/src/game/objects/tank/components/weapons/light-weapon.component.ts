import { WeaponComponent } from "./weapon.component";

export class LightWeaponComponent extends WeaponComponent {
  public modelName: string = "light-weapon";
  constructor(id: string) {
    super(id, "light-weapon");
  }
}
