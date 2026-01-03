import { Socket } from "socket.io";
import { Player } from "../../player";

export class SetSocketCommand {
  constructor(private socket: Socket) { }

  execute(player: Player) {
    player.setSocket(this.socket);
  }
}
