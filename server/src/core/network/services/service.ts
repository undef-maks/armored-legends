import { Socket } from "socket.io";
import { Player } from "../../player";
import { TankNetworkStateFull } from "@shared/types/tank/tank";

export interface IService {

}

export interface IAuthService extends IService {
  createPlayer: (socket: Socket, name: string) => Player;
  authPlayer: (socket: Socket, token: string) => Player;
  findPlayer: (params: { socketId?: string, token?: string }) => Player | null;
}

export interface IGameService extends IService {
  getPlayerSocket: (playerId: string) => Socket | null;
}
