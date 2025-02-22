import chalk from "chalk";
import fse from "fs-extra";
import { Command } from "commander";
import { Config, RemoveOpts } from "../types.js";
import { CONFIG_FILE, ensureConfigFile } from "../utils/config.js";

const remove = new Command("remove");

remove.description(
  `removes a configuration setted by the ${chalk.inverse("set")} command.`
);

// === RM - Alias ===
remove.alias("rm");

// === Name - Argument | Required ===
remove.requiredOption(
  "-n, --name <name>",
  "removes the configuration with the specified name."
);

remove.action(async function (this: Command) {
  const opts = this.opts<RemoveOpts>();
  try {
    ensureConfigFile();
    const configs: Config[] = JSON.parse(
      fse.readFileSync(CONFIG_FILE, "utf-8")
    );

    if (!configs.some((config) => config.name === opts.name)) {
      throw new Error(`${opts.name} - Config not found.`);
    }

    const selectedConfig = configs.find(
      (config) => config.name === opts.name
    ) as Config;

    const updatedConfigs = configs.filter(
      (config) => config.name !== opts.name
    );

    if (selectedConfig.active && updatedConfigs.length > 0) {
      (
        updatedConfigs.find((config) => config.name === "base") as Config
      ).active = true; // 'base' config back to active
    }

    fse.writeFileSync(CONFIG_FILE, JSON.stringify(updatedConfigs, null, 2));
    console.log(chalk.green(`${opts.name} - Config removed successfully.`));
  } catch (error) {
    console.error(chalk.red((error as Error).message));
  }
});

export default remove;
