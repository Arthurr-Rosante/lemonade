import chalk from "chalk";
import fse from "fs-extra";
import { Command } from "commander";
import { Config, SetOpts } from "../types.js";
import { CONFIG_FILE, ensureConfigFile } from "../utils/config.js";

const set = new Command("set");

set.description(
  `creates a configuration that receives a name and can be called by the ${chalk.inverse(
    "clean"
  )} command through ${chalk.inverse("lemonade clean -n <name>")}`
);

set.requiredOption(
  "-n, --name <name>",
  "saves the configuration with the specified name."
);
set.requiredOption(
  "-p, --path <folder_path...>",
  "saves the configuration with the specified path."
);
set.option(
  "-D, --default",
  `saves the configuration as the new default folder called by ${chalk.inverse(
    "lemonade clean"
  )}`,
  false
);

set.action(async function (this: Command) {
  const opts = this.opts<SetOpts>();
  Array.isArray(opts.path) ? (opts.path = opts.path?.join(" ")) : opts.path;

  try {
    ensureConfigFile();
    const configs: Config[] = JSON.parse(
      fse.readFileSync(CONFIG_FILE, "utf-8")
    );

    if (configs.some((config) => config.name === opts.name)) {
      throw new Error(`${opts.name} - Config already exists.`);
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
      ? console.log(`Default folder set to ${opts.name}`)
      : console.log(`Folder ${opts.name} saved successfully.`);
  } catch (error) {
    console.error(error);
  }
});

export default set;
