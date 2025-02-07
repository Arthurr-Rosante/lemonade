import { Command } from "commander";
import fse from "fs-extra";
import chalk from "chalk";
import path from "path";
import { CleanOpts } from "../types.js";

const TEMP_FOLDER = process.env.TEMP as string;

const logResults = (cleaned: string[], skipped: string[]) => {
  console.log(chalk.gray("\n+========================================+"));
  console.log(chalk.bold.green("✅ Cleanup Completed!\n"));

  if (cleaned.length || skipped.length) {
    console.log(chalk.green("✔ Cleaned:"));
    cleaned.forEach((file) =>
      console.log(chalk.green(`  ✔ - ${chalk.bold(file)}`))
    );

    console.log(chalk.yellow("\n⚠ Skipped:"));
    skipped.forEach((file) =>
      console.log(chalk.yellow(`  ⚠ - ${chalk.bold(file)}`))
    );
  }

  console.log(chalk.gray("\n+========================================+\n"));
};

const clean = new Command("clean")
  .description("deletes all files in the `%temp%` folder.")
  .option(
    "--sl, --show-log",
    "Expands the summary screen, showing which files were deleted/skipped."
  )
  .action(async function (this: Command) {
    const options = this.opts<CleanOpts>();

    try {
      const files = await fse.readdir(TEMP_FOLDER);
      const result = await Promise.allSettled(
        files.map(async (file) => {
          const filePath = path.join(TEMP_FOLDER, file);
          return fse.remove(filePath).then(() => ({
            filePath,
            status: "cleaned",
          }));
        })
      );

      const cleaned = result
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value.filePath);

      const skipped = result
        .filter((result) => result.status === "rejected")
        .map((result) => result.reason.path);

      options.showLog
        ? logResults(cleaned, skipped)
        : console.log(
            chalk.gray("\nSummary:") +
              `\n  ${chalk.green("✔ Cleaned:")}  ${chalk.bold(
                cleaned.length
              )} files` +
              `\n  ${chalk.yellow("⚠ Skipped:")}  ${chalk.bold(
                skipped.length
              )} files\n`
          );
    } catch (error) {
      console.log(chalk.bold.red("\n❌ Error Cleaning temp files...\n"));
      console.error(error);
    }
  });

export default clean;
