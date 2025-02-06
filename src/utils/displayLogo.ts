import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function displayLogo(): void {
  const logoPath = path.join(__dirname, "../assets/logo.txt");

  try {
    const logo = fs.readFileSync(logoPath, "utf-8");
    console.log(chalk.greenBright(logo));
  } catch (error) {
    console.log(chalk.red("⚠️  Logo file not found!"));
  }
}
