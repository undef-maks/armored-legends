import { Server } from "socket.io";
import { AuthController } from "./controllers/auth.controller";
import PlayerManager from "../managers/player-manager";
import { GameController } from "./controllers/game.controller";
import { authMiddleware } from "./middlewares/auth.middleware";
import { GameService } from "./services/game.service";
import { GameManager } from "../managers/game-manager";
import { PhysicsManager } from "../managers/physics-manager";

export let controllers: {
  auth: AuthController;
  game: GameController;
};

export function createNetwork(io: Server) {
  const playerManager = PlayerManager.getInstance();
  const gameNsp = io.of("game");
  const authNsp = io.of("auth");

  const physicsManager = new PhysicsManager();
  const gameManager = new GameManager(physicsManager);

  const gameService = new GameService(playerManager, gameManager);

  gameManager.start();

  const authController = new AuthController(playerManager);
  const gameController = new GameController(gameService);

  controllers = {
    auth: authController,
    game: gameController
  };

  authNsp.on("connection", (socket) => {
    authController.bind(socket);
  })

  gameNsp.use(authMiddleware(authController.authService));
  gameNsp.on("connection", (socket) => {
    gameController.bind(socket);
    gameController.connect(socket);
  })

  return {
    authNsp,
    gameNsp,
    gameController
  };
}

