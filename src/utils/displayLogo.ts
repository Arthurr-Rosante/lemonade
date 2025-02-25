import path from "path";
import os from "os";
import fse from "fs-extra";
import { CONFIG_FOLDER } from "./config.js";
import chalk from "chalk";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOGO_FILE = path.join(CONFIG_FOLDER, "logo.txt");

export function displayLogo() {
  const logo = fse.readFileSync(
    path.resolve(__dirname, "../assets/logo.txt"),
    "utf-8"
  );

  if (!fse.existsSync(CONFIG_FOLDER)) {
    fse.mkdirSync(CONFIG_FOLDER, { recursive: true });
  }

  if (!fse.existsSync(LOGO_FILE)) {
    fse.writeFileSync(LOGO_FILE, logo, "utf-8");
  }

  console.log(chalk.greenBright(logo));
}