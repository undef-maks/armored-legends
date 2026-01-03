import { Scene } from "@babylonjs/core";

export interface ISceneManager {
  scenes: Record<string, Scene>;

  getScene(name: string): Scene | null;
  update(): void;


}
