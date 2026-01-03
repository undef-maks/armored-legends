import { WeaponComponent } from "./weapon.component";

export class MediumWeaponComponent extends WeaponComponent {
  constructor(id: string) {
    super(id, "medium-weapon");
  }
}
