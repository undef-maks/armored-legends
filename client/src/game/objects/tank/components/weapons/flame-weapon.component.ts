import { WeaponComponent } from "./weapon.component";

export class FlameWeaponComponent extends WeaponComponent {
  public modelName: string = "flame-weapon";
  constructor(id: string) {
    super(id, "flame-weapon");
  }

  update(dt: number): void {
    // this.rootNode.rotation.y += 0.001;
  }
}
