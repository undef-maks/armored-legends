import { ArmoredTracksComponent, FlameWeaponComponent } from "./components";
import { HeavyBodyComponent } from "./components/body/body-component";
import { Tank } from "./tank";
import { v4 as uuid } from "uuid";

export class StarterTank extends Tank {

  constructor(id: string, playerId: string, playerName: string) {
    super(id, playerId, 0, 0, {
      weapon: new FlameWeaponComponent(uuid()),
      tracks: new ArmoredTracksComponent(uuid()),
      body: new HeavyBodyComponent(uuid())
    }, playerName);
  }
}
