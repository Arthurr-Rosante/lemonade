import chalk from "chalk";
import fse from "fs-extra";
import { Command } from "commander";
import { CONFIG_FILE, ensureConfigFile } from "../utils/config.js";
import { Config } from "../types.js";

const set = new Command("set");

set.description(
  `${chalk.hex("00ffb2")(
    ">_"
  )} sets the default configuration to be called by the ${chalk.greenBright(
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

      console.log(
        chalk.green("✔ Success: ") +
          chalk.greenBright(
            `"${name}" has been set as the default configuration.`
          )
      );
    } else {
      throw new Error(
        chalk.bold.red("✖ Error: ") +
          chalk.redBright(`Configuration "${name}" does not exist.`)
      );
    }
  } catch (error) {
    console.error(
      chalk.bold.red("✖ An error occurred: ") +
        chalk.redBright((error as Error).message)
    );
  }
});

export default set;
