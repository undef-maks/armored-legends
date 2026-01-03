import { ScreenManager } from "../ui/screens/screen-manager";
import { AuthClient } from "../network/auth-client";
import { AuthFlow } from "./auth-flow";
import { GameLoader } from "./game-loader";

export class AppBootstrap {
  static async start() {
    const screens = new ScreenManager();
    const auth = new AuthClient();
    const authFlow = new AuthFlow(screens, auth);

    const isAuthorized = await authFlow.start();
    console.log(isAuthorized)
    if (isAuthorized) {
      GameLoader.load();
    }
  }
}

