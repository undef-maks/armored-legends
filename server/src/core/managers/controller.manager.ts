import { Socket } from "socket.io";
import { IController } from "../network/controllers/controller";

export class ControllerManager {
  constructor(public controllers: Record<string, IController>) { }

}

