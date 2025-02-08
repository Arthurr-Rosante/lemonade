import chalk from "chalk";
import schedule from "node-schedule";
import { saveSchedule } from "./scheduleManager.js";

export async function createCron(name: string, hour: number, days: number[]) {
  const id = `task-${Date.now()}`;
  const d = days.join(",");
  const exp = `* ${String(hour)} * * ${d}`;

  try {
    console.log(chalk.green(`✅ Scheduled task at ${hour}:00 on days ${d}`));

    // Salva a tarefa no arquivo
    saveSchedule({
      id,
      name,
      hour,
      days,
      active: true,
    });

    // Agenda a tarefa no node-schedule
    schedule.scheduleJob(id, exp, () => {
      console.log(chalk.yellow("⚡ Running scheduled cleanup..."));
    });
  } catch (error) {
    console.error(error);
  }
}
