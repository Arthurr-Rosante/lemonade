#!/usr/bin/env node

import chalk from "chalk";
import { Command } from "commander";
import { displayLogo } from "./utils/displayLogo.js";

import clean from "./commands/clean.js";
import list from "./commands/list.js";
import add from "./commands/add.js";
import remove from "./commands/remove.js";
import set from "./commands/set.js";

const program = new Command(chalk.bold.greenBright("Lemonade CLI"))
  .description(">_ A CLI tool for cleaning temp files and scheduling tasks.")
  .version("1.0.0", "-v, --version", "Show CLI version");

program.addHelpText(
  "after",
  chalk.greenBright(`
  ══════════════════════════════════════════════════════════
   Need Help? Run ${chalk.bold("lemonade <command> --help")}
   More Info: ${chalk.underline("https://github.com/arthurr-rosante/lemonade")}
  ══════════════════════════════════════════════════════════
  `)
);

program.addCommand(clean);
program.addCommand(add);
program.addCommand(remove);
program.addCommand(set);
program.addCommand(list);

if (!process.argv.slice(2).length) {
  displayLogo();
  program.help();
}

program.parse(process.argv);
