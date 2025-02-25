import { Command } from "commander";
import { listConfigs, printRootFolder } from "../utils/config.js";
import chalk from "chalk";

const list = new Command("list");

list.description(
  `${chalk.hex("00ffb2")(
    ">_"
  )} lists saved configurations and shows which one is active.`
);

// === Root - Argument | Optional ===
list.option(
  "-r, --root",
  "logs the path to the folder containing the configurations.",
  false
);

list.action(function (this: Command) {
  const opts = this.opts<{ root: boolean }>();

  if (opts.root) {
    printRootFolder();
    return;
  }

  const configs = listConfigs();
  const list = configs.forEach((config) => {
    console.log(
      `${config.active ? "*" : " "} ${config.name} - ${config.path} `
    );
  });
  return list;
});

export default list;
