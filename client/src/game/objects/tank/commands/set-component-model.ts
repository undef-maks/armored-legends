import { TankComponentCategory } from "@shared/types/tank/components/types";
import { TankComponent } from "../components/component";
import { AssetManager } from "@core/asset-manager";
import { TracksComponent } from "../components/tracks/tracks.component";
import { TransformNode } from "@babylonjs/core";

const MODEL_FOLDERS: Record<TankComponentCategory, string> = {
  "body": "components/bodies",
  "tracks": "components/tracks",
  "weapon": "components/weapons"
};

export class SetComponentModel {
  constructor(private modelName: string) { }

  async execute(component: TankComponent) {
    const assetManager = AssetManager.getInstance();
    const src = MODEL_FOLDERS[component.category];

    try {
      const model = await assetManager.loadModel(this.modelName + ".glb", src);
      component.onModelLoad(model);

      component.isLoaded = true;
    } catch (err) {
      console.error(err);
    }
  }

}
