import { Socket } from "socket.io";
import { GameObjectState } from "../../../types/objects/object-state";
import { GameUpdateResponse } from "@shared/events/game.events";

export type ControllerMethod =
  ((socket: Socket, data: any) => void)

export interface IController {
  name: string;
  methods: Record<string, ControllerMethod>;
}

export abstract class Controller implements IController {
  methods: Record<string, ControllerMethod>;
  name: string;

  bind(socket: Socket) {
    for (const [event, method] of Object.entries(this.methods)) {
      console.log(`REGISTER ${event}`);
      socket.on(`${event}`, (data) =>
        method(socket, data)
      );
    }
  }
}

export interface IAuthController extends IController {
  name: "auth";

  register: (socket: Socket, data: { name: string }) => void,
  verify: (socket: Socket, data: { token: string }) => void,
  auth: (socket: Socket, data: { token: string }) => void
}

export interface IGameController extends IController {
  name: "world-state";

  update: (playerId: string, data: GameUpdateResponse) => void;
  message: (socket: Socket, data: Message) => void;
}

export type Message = {
  title: string;
  description: string;
}
