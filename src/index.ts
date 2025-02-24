#!/usr/bin/env node

import { Command} from 'commander';
import { displayLogo } from "./utils/displayLogo.js";
import clean from "./commands/clean.js";
import list from "./commands/list.js";
import add from "./commands/add.js";
import remove from "./commands/remove.js";
import set from "./commands/set.js";

const program = new Command("lemonade")
  .description("A CLI tool for cleaning temp files and scheduling tasks.")
  .version("1.0.0", "-v, --version", "Show CLI version");

program.addCommand(clean);
program.addCommand(list);
program.addCommand(add);
program.addCommand(remove);
program.addCommand(set);

if (!process.argv.slice(2).length) {
  displayLogo();
  program.help();
}

program.parse(process.argv);
