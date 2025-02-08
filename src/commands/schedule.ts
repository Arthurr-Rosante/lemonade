import { Command } from "commander";
import chalk from "chalk";
import { ScheduleOpts } from "../types.js";
import { createCron } from "../utils/createCron.js";

const schedule = new Command("schedule")
  .description(
    "Defines a customizable monthly cleanup schedule on your system."
  )
  .alias("scdl")
  .option("-n, --name <name>", "Defines the name of the schedule setup.")
  .option(
    "-d, --days <days>",
    "Defines a list of weekdays (comma-separated). [0-6]",
    (value) => {
      const days = value.split(",").map(Number);

      const invalidDays = days.filter((d) => d < 0 || d > 6);
      if (invalidDays.length > 0) {
        console.error(
          chalk.bold.red(
            `❌ Invalid days: Must be a list of numbers between 0-6`
          )
        );
        return;
      }

      return days.filter((d, i) => {
        return days.indexOf(d) === i;
      });
    }
  )
  .option("-h, --hour <hour>", "Defines the hour to clean. [0-23]", (value) => {
    const parsed = parseInt(value, 10);
    if (isNaN(parsed) || parsed < 0 || parsed > 23) {
      console.error(
        chalk.bold.red("❌ Invalid hour: Must be a number between 0-23.")
      );
      return;
    }
    return parsed;
  })
  .option("-D, --default", "Defines a default schedule config.", false)
  .action(async function (this: Command) {
    const options = this.opts<ScheduleOpts>();

    try {
      if (options.default) {
        options.days = [0];
        options.hour = 0;
        options.name = `preset-${1}`;
      } else {
        if (!options.name || !options.days || !options.hour) {
          throw new Error(
            chalk.bold.yellow(
              `⚠. -n, -d, and -h are required unless -D is provided.`
            )
          );
        }
      }
    } catch (error) {
      console.error((error as Error).message);
      process.exit(1);
    }
  });

export default schedule;
