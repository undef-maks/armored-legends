import { Tank } from "../tank";

export abstract class Ability {
  lastTimeUsed: number;

  abstract use(tank: Tank): void;
}
