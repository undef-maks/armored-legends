import { Tank } from "../tank";

export interface ITankCommand {
  execute(tank: Tank): void;
}

