import { AuthClient } from "../network/auth-client";
import { ScreenManager } from "../ui/screens/screen-manager";
import { LoadingScreen } from "../ui/screens/loading-screen";
import { LoginScreen } from "../ui/screens/login-screen";

export class AuthFlow {
  constructor(
    private screens: ScreenManager,
    private auth: AuthClient
  ) { }

  async start(): Promise<boolean> {
    const token = localStorage.getItem("token");

    if (token) {
      this.screens.show(new LoadingScreen());
      const ok = await this.auth.tryAuthWithToken(token);
      if (ok.success) return true;
    }

    return await this.showLoginScreen();
  }

  private async showLoginScreen(): Promise<boolean> {
    return new Promise((resolve) => {
      this.screens.show(
        new LoginScreen(async (name) => {
          this.screens.show(new LoadingScreen());

          const res = await this.auth.registerName(name);

          if (res.success && res.token) {
            localStorage.setItem("token", res.token);
            resolve(true);
          } else {
            alert("Помилка! Ім'я зайняте або інша проблема");
            this.showLoginScreen().then(resolve);
          }
        })
      );
    });
  }
}

