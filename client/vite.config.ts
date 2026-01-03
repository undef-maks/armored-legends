import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@core": path.resolve(__dirname, "src/core"),
      "@game": path.resolve(__dirname, "src/game"),
      "@network": path.resolve(__dirname, "src/network"),
      "@ui": path.resolve(__dirname, "src/ui"),
      "@types": path.resolve(__dirname, "src/types"),
      "@bootstrap": path.resolve(__dirname, "src/bootstrap"),
      "@shared": path.resolve(__dirname, "../shared")
    }
  }
});

