import { Command } from "commander";
import fse from "fs-extra";
import chalk from "chalk";
import path from "path";

const clean = new Command("clean")
  .description("deletes all files in the `%temp%` folder.")
  .action(async () => {
    const tempFolder = process.env.TEMP as string;
    const testFolder = "C:\\Users\\arthu\\Projetos\\CliTestFolder";
    try {
      console.log(chalk.green("🧹 Cleaning temp files..."));

      const files = await fse.readdir(tempFolder);
      for (const file of files) {
        const filePath = path.join(tempFolder, file);
        try {
          await fse.remove(filePath);
          console.log(chalk.blue(`✅ Removed: ${filePath}`));
        } catch (error) {
          if (error.code === "EBUSY") {
            console.log(chalk.yellow(`⚠️ File in use, skipping: ${filePath}`));
          } else {
            console.error(chalk.red(`! Error removing ${filePath}:`), error);
          }
        }
      }
      console.log(chalk.blue("✅ Temp files cleaned successfully!"));
    } catch (error) {
      console.log(chalk.red("! Error Cleaning temp files..."));
      console.error(error);
    }
  });

export default clean;

// console.log(chalk.green("🧹 Cleaning temp files..."));
// cleanup logic...
// console.log(chalk.blue("✅ Temp files cleaned successfully!"));
