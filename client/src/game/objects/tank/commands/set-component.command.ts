import { TankComponentsNetworkState, TankComponentsNetworkStateFull } from "@shared/types/tank/tank";
import { Tank } from "../tank";
import { BodyComponentType, TracksComponentType, WeaponComponentType } from "@shared/types/tank/components/types";
import {
  LightBodyComponent, HeavyBodyComponent
} from "../components/bodies";
import { ArmoredTracksComponent, MediumTracksComponent } from "../components/tracks";
import { TracksComponent } from "../components/tracks/tracks.component";
import { WeaponComponent } from "../components/weapons/weapon.component";
import { FlameWeaponComponent, HeavyWeaponComponent, LightWeaponComponent, MediumWeaponComponent } from "../components/weapons";
import { TankBodyComponent } from "../components/bodies/tank-body.component";
import { SetComponentModel } from "./set-component-model";

const TRACKS_FACTORY: Record<TracksComponentType, (id: string) => TracksComponent> = {
  "medium-tracks": (id: string) => new MediumTracksComponent(id),
  "armored-tracks": (id: string) => new ArmoredTracksComponent(id)
};

const WEAPON_FACTORY: Record<WeaponComponentType, (id: string) => WeaponComponent> = {
  "medium-weapon": (id: string) => new MediumWeaponComponent(id),
  "light-weapon": (id: string) => new LightWeaponComponent(id),
  "flame-weapon": (id: string) => new FlameWeaponComponent(id),
  "heavy-weapon": (id: string) => new HeavyWeaponComponent(id),
};

const BODY_FACTORY: Record<BodyComponentType, (id: string) => TankBodyComponent> = {
  "heavy-body": (id: string) => new HeavyBodyComponent(id),
  "light-body": (id: string) => new LightBodyComponent(id),
};

export class SetComponentsCommand {
  constructor(private components: TankComponentsNetworkStateFull | TankComponentsNetworkState) {

  }

  async execute(tank: Tank) {
    tank.updatedComponentsId = this.components.updatedId;

    const { tracks, body, weapons } = this.components;

    if (!tank.components.body || tank.components.body.id !== body.id) {
      tank.components.body = BODY_FACTORY[body.type](body.id);
      const setModel = new SetComponentModel(tank.components.body.modelName);
      await setModel.execute(tank.components.body);
      tank.components.body.setParent(tank.tankRoot);
    }

    if (!tank.components.tracks || tank.components.tracks.id !== tracks.id) {
      tank.components.tracks = TRACKS_FACTORY[tracks.type](tracks.id);
      const setModel = new SetComponentModel(tank.components.tracks.modelName);
      await setModel.execute(tank.components.tracks);

      if (tank.components.body.rootNode)
        tank.components.tracks.setParent(tank.components.body.rootNode);

      tank.components.tracks.changeOffsets(tank.components.body.offsets);
    }

    if (!tank.components.weapon || tank.components.weapon.id !== weapons.id) {
      if (tank.components.weapon)
        tank.components.weapon.rootNode.dispose();

      tank.components.weapon = WEAPON_FACTORY[weapons.type](weapons.id);

      const setModel = new SetComponentModel(tank.components.weapon.modelName);
      await setModel.execute(tank.components.weapon);

      if (tank.components.body.rootNode)
        tank.components.weapon.setParent(tank.components.body.rootNode);

      tank.components.weapon.changeOffsets(tank.components.body.offsets);
    }
    console.log(this.components)

  }
  private setWeapon = (): void => { };
  private setBody = (): void => { };
  private setTracks = (): void => { }

  // private async syncComponent<T>(
  //   tank: Tank, key: T, data: { id: string, type: any }, factory: Record<string, (id: string) => T>
  // ): Promise<void> {
  //   const current = tank.components[key];
  //
  //   if (!current || current.id !== data.id) {
  //     const component = factory[data.type](data.id);
  //     component.setParent(tank.tankRoot);
  //
  //     tank.components[key] = component;
  //
  //     // await new SetComponentModel().execute(component);
  //   }
  // }
}


export function verifyComponents(tank: Tank, components: TankComponentsNetworkState): boolean {
  if (!tank.components.tracks || tank.components.tracks.id !== components.tracks.id) {
    return false;
  }

  if (!tank.components.body || tank.components.body.id !== components.body.id) {
    return false;
  }
  //
  if (!tank.components.weapon || tank.components.weapon.id !== components.weapons.id) {
    return false;
  }

  return true;
}

