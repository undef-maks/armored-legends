import { TankBodyComponent } from "./tank-body.component";

export class LightBodyComponent extends TankBodyComponent {
  public modelName: string = "light-body";
  constructor(id: string) {
    super(id, "light-body");
  }

  update(dt: number): void { }

  updateNetworkState(data: any): void { }
}
