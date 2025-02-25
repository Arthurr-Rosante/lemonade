import { Command } from "commander";
import fse from "fs-extra";
import chalk from "chalk";
import path from "path";
import { CleanOpts, Config, IError, Status } from "../types.js";
import { CONFIG_FILE, ensureConfigFile } from "../utils/config.js";

const clean = new Command("clean");

clean.description(
  `${chalk.hex("00ffb2")(
    ">_"
  )} excludes all files in a fodler. Default: ${chalk.greenBright(
    `%temp%`
  )} folder.`
);

// === Path - Argument | Optional ===
clean.option(
  "-p, --path <folder_path...>",
  `executes the ${chalk.greenBright("clean")} command in the specified folder.`
);
// === Name - Argument | Optional ===
clean.option(
  "-n, --name <name>",
  `executes the ${chalk.greenBright(
    "clean"
  )} command in the matching folder set by the ${chalk.greenBright(
    "set"
  )} command.`
);
// === Log - Flag | Optional ===
clean.option("-l, --log", "logs the results of the cleaning operation");

clean.action(async function (this: Command) {
  const opts = this.opts<CleanOpts>();
  const status: Status = { cleaned: [], skipped: [] };

  try {
    ensureConfigFile();
    const configs: Config[] = JSON.parse(
      fse.readFileSync(CONFIG_FILE, "utf-8")
    );

    if (!opts.path && !opts.name) {
      const active = configs.find((config) => config.active === true);
      if (!active) throw new Error("No default config set...");
      opts.path = active.path;
    } else if (!opts.path && opts.name) {
      const config = configs.find((config) => config.name === opts.name);
      if (!config) throw new Error(`${opts.name} - Config does not exist.`);
      opts.path = config.path;
    } else if (Array.isArray(opts.path) && !opts.name) {
      const fullPath = opts.path?.join(" ");
      opts.path = fullPath;
    } else if (opts.path && opts.name) {
      const config = configs.find((config) => config.name === opts.name);
      if (!config) throw new Error(`${opts.name} - Config does not exist.`);
      Array.isArray(opts.path) ? (opts.path = opts.path?.join(" ")) : opts.path;
    } else {
      throw new Error("Invalid arguments");
    }

    const files = await fse.readdir(opts.path as string);
    for (const file of files) {
      const fpath = path.join(opts.path as string, file);
      try {
        await fse.remove(fpath);
        status.cleaned.push(fpath);
      } catch (error) {
        if ((error as IError).code === "EBUSY" || "EPERM") {
          status.skipped.push(fpath);
        } else {
          throw error;
        }
      }
    }

    opts.log
      ? logResults(status, opts.path as string)
      : console.log(
          chalk.bold(
            "\n==================== | Summary | ==================== \n"
          ) +
            `\n ${chalk.bold.green(
              "Cleaned "
            )} ------------------------------- ${chalk.white.bold(
              status.cleaned.length
            )} files` +
            `\n ${chalk.bold.yellow(
              "Skipped "
            )} ------------------------------- ${chalk.white.bold(
              status.skipped.length
            )} files\n` +
            `\n\n ${chalk.bold("📂 Path:")} ${chalk.cyan(opts.path)}\n` +
            "\n=====================================================\n"
        );
  } catch (error) {
    console.log(chalk.bold.red("\n❌ Error Cleaning temp files...\n"));
    console.error(error);
  }
});

const logResults = (status: Status, path: string) => {
  const { cleaned, skipped } = status;

  console.log(
    chalk.bold("\n===================== | Logs | =====================\n")
  );

  console.log(`${chalk.bold("📂 Path:")} ${chalk.cyan(path)}\n`);

  if (cleaned.length || skipped.length) {
    console.log(chalk.green.bold(`\n✔ Cleaned (${cleaned.length} files):\n`));
    cleaned.forEach((file, index) =>
      console.log(chalk.green(`  ${index + 1}. ${chalk.bold(file)}`))
    );

    console.log(chalk.yellow.bold(`\n⚠ Skipped (${skipped.length} files):\n`));
    skipped.forEach((file, index) =>
      console.log(chalk.yellow(`  ${index + 1}. ${chalk.bold(file)}`))
    );
  } else {
    console.log(chalk.gray("\nNo files were cleaned or skipped."));
  }

  console.log("\n======================================================\n");
};

export default clean;
