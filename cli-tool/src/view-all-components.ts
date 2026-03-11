import path from "node:path";
import fs from "fs-extra";
import chalk from "chalk";
import { getProjectPaths } from "./get-project-paths.js";
import { wait } from "./w8.js";

export async function viewAllComponents() {
  const paths = getProjectPaths();
  const serverComponentsDir = path.join(
    paths.server,
    "src",
    "objects",
    "tank",
    "components",
  );

  const componentFiles = [
    { type: "Корпуси", file: "body/body-component.ts" },
    { type: "Гусениці", file: "tracks/tracks-component.ts" },
    { type: "Зброя", file: "weapon/weapon-component.ts" },
  ];

  console.log(chalk.bold.cyan("\n📋 ПЕРЕГЛЯД ВСІХ КОМПОНЕНТІВ"));
  console.log(chalk.dim("------------------------------------------"));

  for (const item of componentFiles) {
    const filePath = path.join(serverComponentsDir, item.file);

    if (!fs.existsSync(filePath)) {
      console.log(chalk.red(`\n файл не знайдено: ${item.file}`));
      continue;
    }

    const content = await fs.readFile(filePath, "utf-8");
    const classRegex =
      /export class (\w+) extends (\w+) {\s+constructor\(id: string\) {\s+super\(id, "([^"]+)", ([\s\S]*?)\);\s+}/g;

    let match;
    console.log(chalk.bold.yellow(`\n=== ${item.type} ===`));

    let found = false;
    while ((match = classRegex.exec(content)) !== null) {
      found = true;
      const [_, className, parentClass, id, args] = match;
      const cleanArgs = args.replace(/\s+/g, " ").trim();

      console.log(`${chalk.green("ID:")} ${chalk.bold(id)}`);
      console.log(`${chalk.blue("Клас:")} ${className}`);
      console.log(`${chalk.magenta("Параметри:")} [${cleanArgs}]`);
      console.log(chalk.dim("---"));
    }

    if (!found) console.log(chalk.dim("Компонентів не знайдено."));
  }

  await wait();
}
