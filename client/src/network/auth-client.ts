import { AuthError, AuthRegisterResponse } from "@shared/events/auth-events";
import { io, Socket } from "socket.io-client";

const SERVER_URL = "http://localhost:3000";

export class AuthClient {
  private socket: Socket | null = null;

  tryAuthWithToken(token: string): Promise<{ success: boolean; }> {
    return new Promise((resolve) => {
      this.socket = io(`${SERVER_URL}/auth`);
      const { socket } = this;

      this.socket.on("connect", () => {
        socket.emit("auth", { token });
      });

      this.socket.on("auth", (data) => {
        resolve({ success: true });
      });

      this.socket.once("error", (data: AuthError) => {
        if (data.type == "FAILED_AUTH")
          resolve({ success: false });
        else {
          console.warn("Unknown error", data);
          resolve({ success: false })
        }
      })
    });
  }

  registerName(name: string): Promise<{ success: boolean, token?: string }> {
    return new Promise((resolve) => {
      this.socket = io(`${SERVER_URL}/auth`);
      const { socket } = this;

      this.socket.on("connect", () => {
        socket.emit("register", { name });
      });

      this.socket.on("register", (data: AuthRegisterResponse) => {
        resolve({ success: true, token: data.token });
      })

      this.socket.once("error", (data: AuthError) => {
        resolve({ success: false });
      });
    });
  }
}

