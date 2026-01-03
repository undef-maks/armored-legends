import { Socket } from "socket.io";
import { Controller, ControllerMethod, IAuthController } from "./controller";
import { AuthService } from "../services/auth.service";
import PlayerManager from "../../managers/player-manager";
import { AuthError, AuthRegisterRequest, AuthRegisterResponse } from "@shared/events/auth-events";

const EVENTS = {
  AUTH: "auth",
  REGISTER: "register",
  ERROR: "error"
};

export enum AuthErrorType {
  FAILED_AUTH = "FAILED_AUTH",
  FAILED_REGISTER = "FAILED_REGISTER",
};

export class AuthController extends Controller implements IAuthController {
  name: "auth";
  readonly methods: Record<string, ControllerMethod>;
  authService: AuthService;

  constructor(playerManager: PlayerManager) {
    super();

    this.methods = {
      "auth": this.auth,
      "verify": this.verify,
      "register": this.register
    };

    this.authService = new AuthService(playerManager);
  }

  public auth = (socket: Socket, data: { token: string; }) => {
    try {
      console.log(data.token);
      const player = this.authService.authPlayer(socket, data.token);
      socket.emit(EVENTS.AUTH, player.id);
    } catch (err) {
      socket.emit(EVENTS.ERROR, { type: AuthErrorType.FAILED_AUTH, message: (err as Error).message } as AuthError);
    }
  };

  verify = (socket: Socket, data: { token: string; }) => { };

  public register = (socket: Socket, data: AuthRegisterRequest) => {
    try {
      const player = this.authService.createPlayer(socket, data.name);
      socket.emit(EVENTS.REGISTER, { playerId: player.id, token: player.token } as AuthRegisterResponse);
    } catch (err) {
      socket.emit(EVENTS.ERROR, { type: AuthErrorType.FAILED_REGISTER, message: (err as Error).message } as AuthError);
    }
  };
}


