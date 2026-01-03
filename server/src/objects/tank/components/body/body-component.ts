import { TankComponent } from "../tank-component";
import { BodyComponentType } from "@shared/types/tank/components/types";
import { BodyComponentFullNetworkState, BodyComponentNetworkState, ITankBodyComponent } from "@shared/types/tank/components/body-component";

export class TankBodyComponent extends TankComponent implements ITankBodyComponent {
  category: "body";

  constructor(
    readonly id: string,
    readonly type: BodyComponentType,
    public mass: number,
    public armor: number,
    public maxHealth: number,
  ) {
    super(id, type, "body");
  }

  getNetworkState(full: boolean): BodyComponentFullNetworkState | BodyComponentNetworkState {
    const fullState: BodyComponentFullNetworkState = {
      id: this.id,
      type: this.type,
      category: this.category,
      mass: this.mass,
      armor: this.armor,
      maxHealth: this.maxHealth
    };

    if (full) return fullState;

    const { mass, armor, ...partial } = fullState;
    return partial;
  }

  public getStats() {
    return {
      id: this.id,
      type: this.type,
      mass: this.mass,
      armor: this.armor,
      maxHealth: this.maxHealth,
    };
  }
}

export class LightBodyComponent extends TankBodyComponent {
  constructor(id: string) {
    super(id, "light-body", 20, 3, 500);
  }
}

export class HeavyBodyComponent extends TankBodyComponent {
  constructor(id: string) {
    super(id, "heavy-body", 20, 3, 500);
  }
}
