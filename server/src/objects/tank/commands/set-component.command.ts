import { TankBodyComponent } from "../components/body/body-component";
import { TankComponent } from "../components/tank-component";
import { TracksComponent } from "../components/tracks/tracks-component";
import { WeaponComponent } from "../components/weapon/weapon-component";
import { ITankCommand } from "./tank-command";
import { Tank } from "../tank";

export class SetComponentCommand implements ITankCommand {
  constructor(private component: TankComponent) { }

  execute(tank: Tank) {
    switch (this.component.category) {
      case "body":
        tank.components.body = this.component as TankBodyComponent;
        break;
      case "tracks":
        tank.components.tracks = this.component as TracksComponent;
        break;
      case "weapon":
        tank.components.weapon = this.component as WeaponComponent;
        break;
    }
  }
}

