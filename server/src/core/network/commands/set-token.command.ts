import { Player } from "../../player";

export class SetTokenCommand {
  constructor(private token: string) { }

  execute(player: Player) {
    player.token = this.token;
  }
}
