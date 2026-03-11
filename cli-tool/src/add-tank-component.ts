import { select, input, confirm } from "@inquirer/prompts";
import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import { wait } from "./w8.js";
import { getProjectPaths } from "./get-project-paths.js";

async function addTankComponent() {
  const paths = getProjectPaths();

  console.log(chalk.bold.cyan("\n🛠  Конструктор нового компонента танка"));
  console.log(chalk.dim("------------------------------------------"));

  const type = await askComponentType();
  if (type === "back") return;

  const name = await askComponentName(type);
  const stats = await askComponentStats(type);
  const modelPath = await askModelPath();

  const data = prepareComponentData(name, type);
  const destPath = path.join(
    paths.client,
    "public",
    "components",
    data.subFolder,
    `${data.id}.glb`,
  );

  displaySummary(data, stats, modelPath, destPath);

  if (!(await confirm({ message: "\nВсе правильно?", default: true }))) {
    console.log(chalk.red("\n❌ Скасовано."));
    return await wait();
  }

  try {
    await copyModelFile(modelPath, destPath);
    await updateSharedTypes(paths, data);
    await updateServerClasses(paths, data, stats);
    await createClientComponentFile(paths, data);
    await updateClientCommand(paths, data);

    console.log(chalk.bold.green("\n✨ Всі операції завершено успішно!"));
  } catch (err) {
    console.error(chalk.red("\n❌ Помилка:"), err);
  }

  await wait();
}

export async function askComponentType() {
  return await select({
    message: "Оберіть тип компонента:",
    choices: [
      { name: "⚙️  Гусениці (Tracks)", value: "tracks" },
      { name: "🛡️  Корпус (Tank Body)", value: "tankBody" },
      { name: "🔫  Пушка (Weapon)", value: "weapon" },
      { name: "↩️  Назад", value: "back" },
    ],
  });
}

async function askComponentName(type: string) {
  return await input({
    message: `Введіть назву для ${chalk.yellow(type)}:`,
    validate: (val) => val.trim().length > 0 || "Назва не може бути порожньою!",
  });
}

async function askComponentStats(type: string) {
  const stats: Record<string, number> = {};
  const getNum = async (m: string) =>
    Number(
      await input({
        message: m,
        validate: (v) => !isNaN(Number(v)) || "Має бути числом",
      }),
    );

  if (type === "tankBody") {
    stats.mass = await getNum("Введіть масу (mass):");
    stats.armor = await getNum("Введіть броню (armor):");
    stats.maxHealth = await getNum("Введіть HP (maxHealth):");
  } else if (type === "tracks") {
    stats.acceleration = await getNum("Введіть прискорення (acceleration):");
    stats.maxSpeed = await getNum("Введіть макс. швидкість (maxSpeed):");
    stats.turnSpeed = await getNum("Введіть швидкість повороту (turnSpeed):");
  } else if (type === "weapon") {
    stats.damage = await getNum("Введіть шкоду (damage):");
    stats.fireRate = await getNum("Введіть скорострільність (fireRate):");
    stats.range = await getNum("Введіть дистанцію (range):");
  }
  return stats;
}

async function askModelPath() {
  return await input({
    message: "Вкажіть шлях до .glb файлу моделі:",
    validate: (val) => {
      const p = val.trim();
      if (!p.endsWith(".glb")) return "Файл повинен мати розширення .glb";
      if (!fs.existsSync(p)) return "Файл не знайдено!";
      return true;
    },
  });
}

function prepareComponentData(name: string, type: string) {
  const typeMap: Record<string, string> = {
    tracks: "tracks",
    tankBody: "body",
    weapon: "weapon",
  };
  const folderMap: Record<string, string> = {
    tracks: "tracks",
    tankBody: "bodies",
    weapon: "weapons",
  };
  const suffix = typeMap[type];
  const id = `${name}-${suffix}`;

  return {
    id,
    suffix,
    type,
    subFolder: folderMap[type],
    className:
      name
        .split("-")
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join("") +
      suffix.charAt(0).toUpperCase() +
      suffix.slice(1) +
      "Component",
  };
}

function displaySummary(
  data: any,
  stats: any,
  modelPath: string,
  destPath: string,
) {
  console.log("\n" + chalk.bgYellow.black(" ПЕРЕВІРКА ДАНИХ "));
  console.log(`${chalk.blue("ID:")}      ${chalk.bold(data.id)}`);
  console.log(`${chalk.blue("Клас:")}    ${chalk.bold(data.className)}`);
  console.log(`${chalk.blue("Модель:")}   ${path.basename(modelPath)}`);
}

async function copyModelFile(src: string, dest: string) {
  await fs.ensureDir(path.dirname(dest));
  await fs.copy(path.resolve(src.trim()), dest);
}

async function updateSharedTypes(paths: any, data: any) {
  const typesFilePath = path.join(
    paths.shared,
    "types",
    "tank",
    "components",
    "types.ts",
  );
  if (!fs.existsSync(typesFilePath)) return;

  let content = await fs.readFile(typesFilePath, "utf-8");
  const typeTarget = `${data.suffix.charAt(0).toUpperCase() + data.suffix.slice(1)}ComponentType`;
  const regex = new RegExp(`(export type ${typeTarget} =[^;]+)`, "s");

  if (regex.test(content)) {
    content = content.replace(regex, (match) => {
      if (match.includes(`"${data.id}"`)) return match;
      return `${match.trim()}\n  | "${data.id}"`;
    });
    await fs.writeFile(typesFilePath, content);
  }
}

async function updateServerClasses(paths: any, data: any, stats: any) {
  const serverFilesMap: Record<
    string,
    { file: string; parent: string; args: string[] }
  > = {
    tankBody: {
      file: "body/body-component.ts",
      parent: "TankBodyComponent",
      args: [stats.mass, stats.armor, stats.maxHealth],
    },
    tracks: {
      file: "tracks/tracks-component.ts",
      parent: "TracksComponent",
      args: [stats.acceleration, stats.maxSpeed, stats.turnSpeed],
    },
    weapon: {
      file: "weapon/weapon-component.ts",
      parent: "WeaponComponent",
      args: [stats.damage, stats.fireRate, stats.range],
    },
  };

  const config = serverFilesMap[data.type];
  const filePath = path.join(
    paths.server,
    "src",
    "objects",
    "tank",
    "components",
    config.file,
  );

  if (fs.existsSync(filePath)) {
    const classTemplate = `\nexport class ${data.className} extends ${config.parent} {
  constructor(id: string) {
    super(id, "${data.id}", ${config.args.join(", ")});
  }
}\n`;
    await fs.appendFile(filePath, classTemplate);
  }
}

async function createClientComponentFile(paths: any, data: any) {
  const clientBaseDir = path.join(
    paths.client,
    "src",
    "game",
    "objects",
    "tank",
    "components",
    data.subFolder,
  );
  const filePath = path.join(clientBaseDir, `${data.id}.component.ts`);

  const parentMap: Record<string, { class: string; file: string }> = {
    tankBody: { class: "TankBodyComponent", file: "tank-body.component" },
    tracks: { class: "TracksComponent", file: "tracks.component" },
    weapon: { class: "WeaponComponent", file: "weapon.component" },
  };

  const parent = parentMap[data.type];
  const content = `import { ${parent.class} } from "./${parent.file}";

export class ${data.className} extends ${parent.class} {
  public modelName: string = "${data.id}";

  constructor(id: string) {
    super(id, "${data.id}");
  }

  update(dt: number): void { }

  updateNetworkState(data: any): void { }
}
`;
  await fs.writeFile(filePath, content);
}

async function updateClientCommand(paths: any, data: any) {
  const commandPath = path.join(
    paths.client,
    "src",
    "game",
    "objects",
    "tank",
    "commands",
    "set-component.command.ts",
  );
  if (!fs.existsSync(commandPath)) return;

  let content = await fs.readFile(commandPath, "utf-8");

  const importPathMap: Record<string, string> = {
    tankBody: "../components/bodies",
    tracks: "../components/tracks",
    weapon: "../components/weapons",
  };

  const targetImportPath = importPathMap[data.type as string];
  const importRegex = new RegExp(
    `import\\s+{[^}]*}\\s+from\\s+"${targetImportPath}";`,
    "s",
  );

  if (content.match(importRegex)) {
    content = content.replace(importRegex, (match) => {
      if (match.includes(data.className)) return match;
      return match.replace("}", `, ${data.className} }`);
    });
  } else {
    const lastImportIndex = content.lastIndexOf("import ");
    const endOfLastImport = content.indexOf(";", lastImportIndex) + 1;
    const newImport = `\nimport { ${data.className} } from "${targetImportPath}";`;
    content =
      content.slice(0, endOfLastImport) +
      newImport +
      content.slice(endOfLastImport);
  }

  const factoryMapName = {
    tracks: "TRACKS_FACTORY",
    tankBody: "BODY_FACTORY",
    weapon: "WEAPON_FACTORY",
  }[data.type as string];

  if (factoryMapName) {
    const factoryRegex = new RegExp(`const ${factoryMapName}[^}]*`, "s");
    content = content.replace(factoryRegex, (match) => {
      if (match.includes(`"${data.id}"`)) return match;
      const cleanMatch = match.trimEnd();
      const needsComma = !cleanMatch.endsWith("{") && !cleanMatch.endsWith(",");
      return `${cleanMatch}${needsComma ? "," : ""}\n  "${data.id}": (id: string) => new ${data.className}(id)`;
    });
  }

  await fs.writeFile(commandPath, content);
}

export default addTankComponent;
