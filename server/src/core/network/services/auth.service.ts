import { Socket } from "socket.io";
import { Player } from "../../player";
import { IAuthService } from "./service";
import { v4 as uuid } from "uuid";
import { SetTokenCommand } from "../commands/set-token.command";
import PlayerManager, { FindPlayerParams } from "../../managers/player-manager";
import { SetSocketCommand } from "../commands/set-socket.command";

export class AuthService implements IAuthService {
  constructor(private manager: PlayerManager) { }

  public authPlayer = (socket: Socket, token: string) => {
    const player = this.manager.findPlayer({ token });

    if (!player) throw Error("Player not found");

    return player;
  };

  public findPlayer = (params: FindPlayerParams) => {
    return this.manager.findPlayer(params);
  };

  public createPlayer = (socket: Socket, playerName: string) => {
    const player = new Player(uuid(), playerName, socket);

    new SetTokenCommand(uuid()).execute(player);

    this.manager.addPlayer(player);
    return player;
  };
}
