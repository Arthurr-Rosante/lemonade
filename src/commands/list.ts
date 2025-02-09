import { Command } from "commander";
import { listSchedules } from "../utils/scheduleManager.js";

const list = new Command("list")
  .description("lists all saved schedules.")
  .action(() => {
    const schedules = listSchedules();
    console.log(schedules);
  });

export default list;
