import path from "node:path";
import fs from "fs-extra";
import chalk from "chalk";
import { select, confirm } from "@inquirer/prompts";
import { getProjectPaths } from "./get-project-paths.js";
import { wait } from "./w8.js";
import { askComponentType } from "./add-tank-component.js";

export async function deleteComponentMenu() {
  console.log("Меню видалення");
  const paths = getProjectPaths();
  const serverComponentsDir = path.join(
    paths.server,
    "src",
    "objects",
    "tank",
    "components",
  );

  const type = await askComponentType();
  if (type === "back") return;

  const configMap: Record<string, { file: string; subFolder: string }> = {
    tankBody: { file: "body/body-component.ts", subFolder: "bodies" },
    tracks: { file: "tracks/tracks-component.ts", subFolder: "tracks" },
    weapon: { file: "weapon/weapon-component.ts", subFolder: "weapons" },
  };

  const config = configMap[type as string];
  const filePath = path.join(serverComponentsDir, config.file);

  if (!fs.existsSync(filePath)) {
    console.log(chalk.red(`\n❌ Файл не знайдено: ${config.file}`));
    return await wait();
  }

  const content = await fs.readFile(filePath, "utf-8");

  const classRegex =
    /export class (\w+) extends \w+ {\s+constructor\(id: string\) {\s+super\(id, "([^"]+)"/g;
  const matches = [...content.matchAll(classRegex)];

  const components = matches.map((m) => ({
    className: m[1],
    id: m[2],
  }));

  if (components.length === 0) {
    console.log(chalk.yellow("\n⚠️  Компонентів у цьому файлі не знайдено."));
    return await wait();
  }

  const target = await select({
    message: "Оберіть конкретний компонент для ВИДАЛЕННЯ:",
    choices: [
      ...components.map((c) => ({
        name: `${chalk.bold(c.id)} (${c.className})`,
        value: c,
      })),
      { name: "↩️  Скасувати", value: null },
    ],
  });

  if (!target) return;

  const isConfirmed = await confirm({
    message:
      chalk.bgRed.white(" УВАГА ") +
      ` Видалити ${target.id}? Це видалить код, модель та типи.`,
    default: false,
  });

  if (!isConfirmed) return;

  try {
    const classBlockRegex = new RegExp(
      `export class ${target.className}[\\s\\S]*?\\n}\\n?`,
      "g",
    );
    const newServerContent = content.replace(classBlockRegex, "");
    await fs.writeFile(filePath, newServerContent);

    const typesPath = path.join(
      paths.shared,
      "types",
      "tank",
      "components",
      "types.ts",
    );
    if (fs.existsSync(typesPath)) {
      let typesContent = await fs.readFile(typesPath, "utf-8");
      typesContent = typesContent.replace(
        new RegExp(`\\s*\\|\\s*"${target.id}"`, "g"),
        "",
      );
      await fs.writeFile(typesPath, typesContent);
    }

    const clientFile = path.join(
      paths.client,
      "src",
      "game",
      "objects",
      "tank",
      "components",
      config.subFolder,
      `${target.id}.component.ts`,
    );
    const modelFile = path.join(
      paths.client,
      "public",
      "components",
      config.subFolder,
      `${target.id}.glb`,
    );

    await fs.remove(clientFile).catch(() => {});
    await fs.remove(modelFile).catch(() => {});

    const cmdPath = path.join(
      paths.client,
      "src",
      "game",
      "objects",
      "tank",
      "commands",
      "set-component.command.ts",
    );
    if (fs.existsSync(cmdPath)) {
      let cmdContent = await fs.readFile(cmdPath, "utf-8");
      cmdContent = cmdContent.replace(
        new RegExp(`\\s*"${target.id}":.*?\\(id\\),?`, "g"),
        "",
      );
      cmdContent = cmdContent.replace(
        new RegExp(`,?\\s*${target.className}\\s*,?`, "g"),
        (m) => (m.includes(",") ? "," : ""),
      );
      await fs.writeFile(cmdPath, cmdContent);
    }

    console.log(
      chalk.bold.green(`\n✅ Компонент ${target.id} успішно видалено.`),
    );
  } catch (err) {
    console.error(chalk.red("\n❌ Помилка при видаленні:"), err);
  }

  await wait();
}
