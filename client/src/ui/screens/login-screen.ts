import { BaseScreen } from "./base-screen";

export class LoginScreen extends BaseScreen {
  constructor(private onSubmit: (name: string) => void) {
    super();
    this.element.innerHTML = `
            <div class="login-screen">
                <h2>Введіть ім'я</h2>
                <input id="name" placeholder="Ваш нікнейм">
                <button id="submit">Продовжити</button>
            </div>
        `;
  }

  onShow(): void {
    const input = this.element.querySelector("#name") as HTMLInputElement;
    const btn = this.element.querySelector("#submit") as HTMLButtonElement;

    btn.onclick = () => {
      const value = input.value.trim();
      if (value.length < 3) {
        alert("Ім'я має бути довше 3 символів");
        return;
      }
      this.onSubmit(value);
    };
  }
}

