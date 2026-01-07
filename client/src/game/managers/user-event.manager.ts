import { v4 as uuid } from "uuid";

export class UserEventManager {
  private pressedKeys: Record<string, boolean> = {};
  private keyDownCallbacks: Record<string, (e: KeyboardEvent) => void> = {};
  private keyUpCallbacks: Record<string, (e: KeyboardEvent) => void> = {};

  constructor(private htmlElement: HTMLElement) {
    this.htmlElement.onkeydown = (event) => this.canvasOnKeyDown(event);
    this.htmlElement.onkeyup = (event) => this.canvasOnKeyUp(event);
  }

  public onKeyDown(callback: (evt: KeyboardEvent) => void): string {
    const id = uuid();
    this.keyDownCallbacks[id] = callback;
    return id;
  }

  public onKeyUp(callback: (e: KeyboardEvent) => void): string {
    const id = uuid();
    this.keyUpCallbacks[id] = callback;
    return id;
  }

  public removeCallback(id: string) {
    if (this.keyUpCallbacks[id]) delete this.keyUpCallbacks[id];
    if (this.keyDownCallbacks[id]) delete this.keyDownCallbacks[id];
  }

  public isPressed = (key: string): boolean => {
    return this.pressedKeys[key] ?? false;
  }

  private canvasOnKeyDown(event: KeyboardEvent) {
    const { key } = event;
    this.pressedKeys[key] = true;

    for (const cb of Object.values(this.keyDownCallbacks)) {
      cb(event);
    }
  }

  private canvasOnKeyUp(event: KeyboardEvent) {
    const { key } = event;

    this.pressedKeys[key] = false;

    for (const cb of Object.values(this.keyUpCallbacks)) {
      cb(event);
    }
  }
}
