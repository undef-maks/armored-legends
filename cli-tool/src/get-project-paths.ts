import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import { wait } from "./w8.js";

export function getProjectPaths() {
  const rootDir = path.resolve(process.cwd(), "..");

  const paths = {
    root: rootDir,
    shared: path.join(rootDir, "shared"),
    client: path.join(rootDir, "client"),
    server: path.join(rootDir, "server"),
  };

  const missing = Object.entries(paths).filter(
    ([name, p]) => !fs.existsSync(p),
  );

  if (missing.length > 0) {
    console.log(
      chalk.yellow(
        `\n⚠️  Попередження: Не знайдено папки: ${missing.map((m) => m[0]).join(", ")}`,
      ),
    );
    console.log(chalk.dim(`Очікуваний шлях: ${rootDir}\n`));
  }

  return paths;
}
