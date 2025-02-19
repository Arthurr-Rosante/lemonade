#!/usr/bin/env node

import { Command } from "commander";
import { displayLogo } from "./utils/displayLogo.js";
import clean from "./commands/clean.js";
import list from "./commands/list.js";

const program = new Command("lemonade")
  .description("A CLI tool for cleaning temp files and scheduling tasks.")
  .version("1.0.0", "-v, --version", "Show CLI version");

program.addCommand(clean);
program.addCommand(list);

if (!process.argv.slice(2).length) {
  displayLogo();
  program.help();
}

program.parse(process.argv);
