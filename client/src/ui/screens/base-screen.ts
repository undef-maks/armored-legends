export abstract class BaseScreen {
  public element: HTMLDivElement;

  constructor() {
    this.element = document.createElement("div");
    this.element.className = "screen";
  }

  abstract onShow(): void;

  destroy() {
    this.element.remove();
  }
}

