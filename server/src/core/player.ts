import { Socket } from "socket.io";
import { IPlayer } from "../types/player/player";

export class Player implements IPlayer {
  token: string;

  constructor(readonly id: string,
    readonly name: string,
    private socket: Socket,
    public tankId?: string) { }

  public getSocket() {
    return this.socket;
  }

  public setSocket(socket: Socket) {
    this.socket = socket;
  }
}
