import { WeaponComponentType } from "@shared/types/tank/components/types";
import { TankComponent } from "../tank-component";
import { ITankWeaponComponent, WeaponComponentFullNetworkState, WeaponComponentNetworkState } from "@shared/types/tank/components/weapon-component";

export class WeaponComponent extends TankComponent implements ITankWeaponComponent {
  category: "weapon";

  constructor(
    readonly id: string,
    readonly type: WeaponComponentType,
    public damage: number,
    public fireRate: number,
    public range: number
  ) {
    super(id, type, "weapon");
  }

  getNetworkState(full: boolean): WeaponComponentFullNetworkState | WeaponComponentNetworkState {
    const fullState: WeaponComponentFullNetworkState = {
      id: this.id,
      type: this.type,
      category: this.category,
      range: this.range,
      damage: this.damage,
      fireRate: this.fireRate
    };

    if (full) return fullState;

    const { damage, range, fireRate, ...partial } = fullState;
    return partial;
  }

  getStats() {
    return {
      id: this.id,
      type: this.type,
      damage: this.damage,
      fireRate: this.fireRate,
      range: this.range,
    };
  }
}

export class HeavyWeaponComponent extends WeaponComponent {
  constructor(id: string) {
    super(id, "heavy-weapon", 10, 0.2, 40);
  }
}

export class FlameWeaponComponent extends WeaponComponent {
  constructor(id: string) {
    super(id, "flame-weapon", 4, 0.01, 50);
  }
}

export class LightWeaponComponent extends WeaponComponent {
  constructor(id: string) {
    super(id, "light-weapon", 4, 0.01, 50);
  }
}

export class MediumWeaponComponent extends WeaponComponent {
  constructor(id: string) {
    super(id, "medium-weapon", 4, 0.01, 50);
  }
}
