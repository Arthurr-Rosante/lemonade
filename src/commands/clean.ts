import { Command } from "commander";
import fse from "fs-extra";
import chalk from "chalk";
import path from "path";
import { CleanOpts } from "../types.js";

const clean = new Command("clean");
const TEMP_FOLDER = process.env.TEMP!;

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
  if (!opts.path && !opts.name) {
    opts.path = TEMP_FOLDER;

    /* [!IMPORTANT!]: Remember to possibly alter the dynamics between Name and Path, since there's a way to make them both interchangeable.
     */
    
  } else if (Array.isArray(opts.path)) {
    const fullPath = opts.path?.join(" ");
    opts.path = fullPath;
  }

  console.log(opts);
});

export default clean;

// const logResults = (cleaned: string[], skipped: string[]) => {
//   console.log(chalk.gray("\n+========================================+"));
//   console.log(chalk.bold.green("✅ Cleanup Completed!\n"));

//   if (cleaned.length || skipped.length) {
//     console.log(chalk.green("✔ Cleaned:"));
//     cleaned.forEach((file) =>
//       console.log(chalk.green(`  ✔ - ${chalk.bold(file)}`))
//     );

//     console.log(chalk.yellow("\n⚠ Skipped:"));
//     skipped.forEach((file) =>
//       console.log(chalk.yellow(`  ⚠ - ${chalk.bold(file)}`))
//     );
//   }

//   console.log(chalk.gray("\n+========================================+\n"));
// };

// const clean = new Command("clean")
//   .description("deletes all files in the `%temp%` folder.")
//   .option(
//     "--sl, --show-log",
//     "Expands the summary screen, showing which files were deleted/skipped."
//   )
//   .action(async function (this: Command) {
//     const options = this.opts<CleanOpts>();

//     try {
//       const files = await fse.readdir(TEMP_FOLDER);
//       const result = await Promise.allSettled(
//         files.map(async (file) => {
//           const filePath = path.join(TEMP_FOLDER, file);
//           return fse.remove(filePath).then(() => ({
//             filePath,
//             status: "cleaned",
//           }));
//         })
//       );

//       const cleaned = result
//         .filter((result) => result.status === "fulfilled")
//         .map((result) => result.value.filePath);

//       const skipped = result
//         .filter((result) => result.status === "rejected")
//         .map((result) => result.reason.path);

//       options.showLog
//         ? logResults(cleaned, skipped)
//         : console.log(
//             chalk.gray("\nSummary:") +
//               `\n  ${chalk.green("✔ Cleaned:")}  ${chalk.bold(
//                 cleaned.length
//               )} files` +
//               `\n  ${chalk.yellow("⚠ Skipped:")}  ${chalk.bold(
//                 skipped.length
//               )} files\n`
//           );
//     } catch (error) {
//       console.log(chalk.bold.red("\n❌ Error Cleaning temp files...\n"));
//       console.error(error);
//     }
//   });

// export default clean;
