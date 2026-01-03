import { io, Socket } from "socket.io-client";
import { GameUpdateResponse, MoveInput } from "@shared/events/game.events";

export class GameClient {
  private socket: Socket | null = null;
  private update: ((data: GameUpdateResponse) => void) | null = null;

  build(token: string) {
    this.socket = io("http://localhost:3000/game", {
      auth: { token: token }
    });

    this.socket.on("update", (data: GameUpdateResponse) => {
      if (this.update)
        this.update(data);
    });
  }

  public sendWeaponChange() {
    if (this.socket) this.socket.emit("weapon-change", {});
  }

  public sendMove(data: MoveInput) {
    if (this.socket) this.socket.emit("move", data);
  }

  public updateSubscribe(callback: (data: GameUpdateResponse) => void) {
    this.update = callback;
  }
}
