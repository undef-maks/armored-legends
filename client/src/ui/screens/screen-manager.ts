import { BaseScreen } from "./base-screen";

export class ScreenManager {
  private current: BaseScreen | null = null;
  private container: HTMLDivElement;

  constructor() {
    this.container = document.createElement("div");
    this.container.id = "ui-root";
    document.body.appendChild(this.container);
  }

  show(screen: BaseScreen) {
    if (this.current) {
      this.current.destroy();
    }
    this.current = screen;
    this.container.innerHTML = "";
    this.container.appendChild(screen.element);
    screen.onShow();
  }
}

