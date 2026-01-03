import { BaseScreen } from "./base-screen";

export class LoadingScreen extends BaseScreen {
  constructor() {
    super();
    this.element.innerHTML = `
            <div class="loading-screen">
                <p>Підключення...</p>
            </div>
        `;
  }

  onShow() { }
}

