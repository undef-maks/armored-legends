import { TankBodyComponent } from "./components/body/body-component";
import { TracksComponent } from "./components/tracks/tracks-component";
import { WeaponComponent } from "./components/weapon/weapon-component";
import { GameObject } from "../game-object";
import { Bodies } from "matter-js";
import { ITank, TankNetworkState, TankNetworkStateFull } from "@shared/types/tank/tank";
import { MoveInput } from "@shared/events/game.events";
import { v4 as uuid } from "uuid";
import { TankComponent } from "./components";
import { SetComponentCommand } from "./commands/set-component.command";
import { Body, Box, Vec3 } from "cannon-es";

import * as CANNON from "cannon-es";
interface TankComponents {
  body: TankBodyComponent,
  tracks: TracksComponent,
  weapon: WeaponComponent,
}

export abstract class Tank extends GameObject implements ITank {
  components: TankComponents;
  angle: number = 0;
  updatedComponentsId: string = uuid();
  input?: MoveInput;

  constructor(
    readonly id: string,
    readonly playerId: string,
    public x: number,
    public y: number,
    components: TankComponents) {
    const body = new Body({
      mass: 130,
      shape: new Box(new Vec3(2, 0.5, 3)),
      position: new Vec3(0, 20, 0),
      linearDamping: 0.5,
      angularDamping: 0.8,
    });

    super(id, body, "tank");
    this.components = components;
  }

  onMove(data: MoveInput) {
    this.input = data;

  }

  setComponent(component: TankComponent) {
    const command = new SetComponentCommand(component);

    command.execute(this);

    this.updatedComponentsId = uuid();
  }

  update() {
    if (!this.input) return;
    const dt = 1 / 60;
    const { body } = this;
    const maxTurnSpeed = (Math.PI) / 2;
    const turn = (this.input.horDirection * -1) * maxTurnSpeed * dt;

    body.angularVelocity.x = 0;
    body.angularVelocity.z = 0;

    if (turn !== 0) {
      const q = new CANNON.Quaternion();
      q.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), turn);
      body.quaternion = body.quaternion.mult(q);
    }

    if (this.input.verDirection) {
      const speed = 7;

      const forward = new CANNON.Vec3(0, 0, this.input.verDirection);

      body.quaternion.vmult(forward, forward);

      body.velocity.x = forward.x * speed;
      body.velocity.z = forward.z * speed;

      body.velocity.y = body.velocity.y;

      body.angularVelocity.x = 0;
      body.angularVelocity.z = 0;
      body.angularVelocity.y = 0;
    }
  }

  getNetworkState(full: boolean): TankNetworkState | TankNetworkStateFull {
    const { position, quaternion } = this.body;
    return {
      id: this.id,
      type: "tank",
      playerId: this.playerId,
      position: position,
      quaternion: quaternion,
      components: {
        body: this.components.body.getNetworkState(full),
        tracks: this.components.tracks.getNetworkState(full),
        weapons: this.components.weapon.getNetworkState(full),
        updatedId: this.updatedComponentsId
      }
    };
  }
}

