import { Command } from "commander";
import fse from "fs-extra";
import chalk from "chalk";
import path from "path";
import { CleanOpts, Config, IError, Status } from "../types.js";
import {
  CONFIG_FILE,
  ensureConfigFile,
  TEMP_FOLDER,
} from "../configs/config.js";

const clean = new Command("clean");

clean.description(
  `empties the folder by excluding all existing files. If no folder
   is specified, cleans the ${chalk.inverse(`%temp%`)} folder by default.`
);

// === Path - Argument | Optional ===
clean.option(
  "-p, --path <folder_path...>",
  `executes the ${chalk.inverse("clean")} command in the specified folder.`
);
// === Name - Argument | Optional ===
clean.option(
  "-n, --name <name>",
  `executes the ${chalk.inverse(
    "clean"
  )} command in the matching folder set by the ${chalk.inverse("set")} command.`
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

    if (!opts.path) {
      const path = configs.find((config) => config.name === "base")?.path;
      if (path) {
        opts.path = path;
      }
    } else if (!opts.path && opts.name) {
      const path = configs.find((config) => config.name === opts.name)?.path;
      if (path) {
        opts.path = path;
      }
    } else {
      opts.path = opts.path;
    }

    const files = await fse.readdir(opts.path);
    for (const file of files) {
      const fpath = path.join(opts.path, file);
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
      ? logResults(status, opts.path)
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
