import { select } from "@inquirer/prompts";
import chalk from "chalk";
import fs from "fs-extra";
import addTankComponent from "./add-tank-component.js";
import { getProjectPaths } from "./get-project-paths.js";
import { wait } from "./w8.js";
import { viewAllComponents } from "./view-all-components.js";
import { deleteComponentMenu } from "./delete-tank-component.js";

async function main() {
  console.clear();
  console.log(chalk.bold.hex("#FFA500")("=== ARMORED TANKS DEV TOOLS ===\n"));

  const paths = getProjectPaths();
  const requiredPaths = ["shared", "client", "server"];
  const missing = requiredPaths.filter((p) => !fs.existsSync(paths[p]));

  if (missing.length > 0) {
    console.log(chalk.bgRed.white.bold(" ПОМИЛКА СТРУКТУРИ ПРОЕКТУ "));
    console.log(
      chalk.red(`Не знайдено папки: ${chalk.bold(missing.join(", "))}`),
    );
    console.log(
      chalk.yellow(`\nЦі папки мають знаходитись поруч із директорією CLI:`),
    );
    console.log(chalk.dim(`Очікуваний корінь: ${paths.root}\n`));
    await wait();
    process.exit(1);
  }

  if (!process.stdin.isTTY) {
    console.log(
      chalk.red(
        "❌ Помилка: Термінал не підтримує інтерактивний ввід (isTTY = false)",
      ),
    );
    return;
  }

  try {
    const answer = await select({
      message: "Обери що хочеш добавити",
      choices: [
        { name: "Новий компонент для танку", value: "tank-component" },
        { name: "Нову декорацію(Поки немає)", value: "decoration" },
        {
          name: "Переглянути існуючі компоненти танку",
          value: "view-components",
        },
        {
          name: "Видалити компонент танку",
          value: "delete-tank-component",
        },
        { name: "Нічого", value: "exit" },
      ],
    });
    switch (answer) {
      case "tank-component":
        await addTankComponent();
        break;

      case "decoration":
        console.log(chalk.cyan("\nПоки в розробці..."));
        await wait();
        break;

      case "view-components":
        await viewAllComponents();
        break;

      case "delete-tank-component":
        await deleteComponentMenu();
        break;

      case "exit":
        console.log(chalk.gray("Ну і петляй"));
        process.exit(0);
        break;
    }

    main();
  } catch (err) {
    console.log(chalk.dim("\nПроцес завершено."));
    process.exit(0);
  }
}

main();
