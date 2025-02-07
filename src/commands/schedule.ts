import { Command } from "commander";
import fse from "fs-extra";
import chalk from "chalk";
import { ScheduleOpts } from "../types.js";

const schedule = new Command("schedule")
  .description(
    "Defines a customizable monthly cleanup schedule on your system."
  )
  .alias("scdl")
  .requiredOption(
    "-n, --name <name>",
    "Defines the name of the schedule setup."
  )
  .requiredOption(
    "-d, --days <days>",
    "Defines a list of weekdays (comma-separated). [0-6]",
    (value) => {
      const days = value.split(",").map(Number);
      const invalidDays = days.filter((d) => d < 0 || d > 6);
      if (invalidDays.length > 0) {
        throw new Error(
          chalk.red(`❌ Invalid days: ${invalidDays.join(", ")}`)
        );
      }
      return days;
    }
  )
  .requiredOption(
    "-h, --hour <hour>",
    "Defines the hour to clean. [0-23]",
    (value) => {
      const parsed = parseInt(value, 10);
      if (isNaN(parsed) || parsed < 0 || parsed > 23) {
        throw new Error("Invalid hour: Must be a number between 0 and 23.");
      }
      return parsed;
    }
  )
  .option("-D, --default", "Defines a default schedule config.", false)
  .action(async function (this: Command) {
    const options = this.opts<ScheduleOpts>();

    if (options.default) {
      console.log(chalk.green("✅ Default schedule applied!"));
      return;
    }

    console.log(chalk.bold.green("\n📅 Schedule Configuration:"));
    console.log(`📌 Name: ${chalk.yellow(options.name)}`);
    console.log(`📅 Days: ${chalk.blue(options.days.join(", "))}`);
    console.log(`⏰ Hour: ${chalk.magenta(options.hour)}h`);
  });

export default schedule;
