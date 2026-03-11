import { input } from "@inquirer/prompts";

export async function wait() {
  await input({
    message: "\nНатисніть Enter, щоб повернутися в меню...",
  });
}
