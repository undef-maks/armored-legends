import { TankBodyComponent } from "./tank-body.component";

export class HeavyBodyComponent extends TankBodyComponent {
  public modelName: string = "heavy-body";
  constructor(id: string) {
    super(id, "heavy-body");
  }

  update(dt: number): void { }

  updateNetworkState(data: any): void { }
}


