import chalk from "chalk";
import fse from "fs-extra";
import { Command } from "commander";
import { Config, AddOpts } from "../types.js";
import { CONFIG_FILE, ensureConfigFile } from "../utils/config.js";

const add = new Command("add");

add.description(
  `${chalk.hex("00ffb2")(
    ">_"
  )} adds a configuration that can be called by ${chalk.greenBright(
    "lemonade clean -n <name>"
  )}`
);

// === Name - Argument | Required ===
add.requiredOption(
  "-n, --name <name>",
  "saves the configuration with the specified name."
);

// === Path - Argument | Required ===
add.requiredOption(
  "-p, --path <folder_path...>",
  "saves the configuration with the specified path."
);

// === Default - Argument | Optional ===
add.option(
  "-D, --default",
  `saves the configuration as the new default folder called by ${chalk.greenBright(
    "lemonade clean"
  )}`,
  false
);

add.action(async function (this: Command) {
  const opts = this.opts<AddOpts>();
  Array.isArray(opts.path) ? (opts.path = opts.path?.join(" ")) : opts.path;

  try {
    ensureConfigFile();
    const configs: Config[] = JSON.parse(
      fse.readFileSync(CONFIG_FILE, "utf-8")
    );

    if (configs.some((config) => config.name === opts.name)) {
      throw new Error(
        chalk.bold.red("✖. Error: ") +
          chalk.redBright(`The configuration "${opts.name}" already exists.`)
      );
    }

    fse.writeFileSync(
      CONFIG_FILE,
      JSON.stringify(
        [
          ...(opts.default
            ? configs.map((config) => ({ ...config, active: false }))
            : configs),
          {
            id: configs.length + 1,
            name: opts.name,
            path: opts.path,
            active: opts.default,
          },
        ],
        null,
        2
      ),
      "utf-8"
    );

    opts.default
      ? console.log(
          chalk.green("✔. Success: ") +
            chalk.greenBright(`"${opts.name}" - created as the default folder.`)
        )
      : console.log(
          chalk.green("✔. Success: ") +
            chalk.greenBright(`"${opts.name}" - folder saved successfully.`)
        );
  } catch (error) {
    console.error(
      chalk.bold.red("✖. An error occurred: ") +
        chalk.redBright((error as Error).message)
    );
  }
});

export default add;
