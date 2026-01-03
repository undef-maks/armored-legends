import { Body } from "cannon-es";

export abstract class GameObject {
  constructor(
    readonly id: string,
    public body: Body,
    public type: string,
  ) { }

  abstract update(): void;
  abstract getNetworkState(full?: boolean): any;
}
