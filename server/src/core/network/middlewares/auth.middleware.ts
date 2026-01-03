import { Socket } from "socket.io";
import { AuthService } from "../services/auth.service";
import { SetSocketCommand } from "../commands/set-socket.command";

export const authMiddleware = (authService: AuthService) => (socket: Socket, next: (err?: any) => void) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Authentication error"));

  const player = authService.findPlayer({ token });
  if (!player) return next(new Error("Invalid token"));

  socket.data.player = player;

  if (player.getSocket().id !== socket.id)
    new SetSocketCommand(socket).execute(player);

  next();
}
