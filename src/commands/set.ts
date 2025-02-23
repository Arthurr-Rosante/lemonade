import chalk from "chalk";
import fse from "fs-extra";
import { Command } from "commander";
import { CONFIG_FILE, ensureConfigFile } from "../utils/config.js";
import { Config } from "../types.js";

const set = new Command("set");

set.description(
  `Sets the default configuration to be called by the ${chalk.inverse(
    "lemonade clean"
  )} command.`
);

set.requiredOption(
  "-n, --name <name>",
  "name of the configuration you want to default."
);

set.action(async function (this: Command) {
  const { name }: { name: string } = this.opts();

  try {
    ensureConfigFile();
    const configs: Config[] = JSON.parse(
      fse.readFileSync(CONFIG_FILE, "utf-8")
    );

    if (configs.some((config) => config.name === name)) {
      fse.writeFileSync(
        CONFIG_FILE,
        JSON.stringify(
          configs.map((config) => ({
            ...config,
            active: config.name === name,
          })),
          null,
          2
        ),
        "utf-8"
      );

      console.log(chalk.green(`${name} - Config set as default.`));
    } else {
      throw new Error(`${name} - Config doesn't exist.`);
    }
  } catch (error) {
    console.error(chalk.red((error as Error).message));
  }
});

export default set;
