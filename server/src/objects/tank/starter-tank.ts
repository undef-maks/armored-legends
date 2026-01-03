import { SetComponentCommand } from "./commands/set-component.command";
import { ArmoredTracksComponent, FlameWeaponComponent, LightWeaponComponent } from "./components";
import { HeavyBodyComponent, LightBodyComponent } from "./components/body/body-component";
import { TankComponent } from "./components/tank-component";
import { Tank } from "./tank";
import { v4 as uuid } from "uuid";

export class StarterTank extends Tank {

  constructor(id: string, playerId: string) {
    super(id, playerId, 0, 0, {
      weapon: new FlameWeaponComponent(uuid()),
      tracks: new ArmoredTracksComponent(uuid()),
      body: new HeavyBodyComponent(uuid())
    });
  }
}
