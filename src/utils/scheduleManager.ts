import fse from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { ScheduledTask } from "../types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCHEDULE_FILE = path.join(__dirname, "schedules.json");

function loadSchedules(): ScheduledTask[] {
  if (!fse.existsSync(SCHEDULE_FILE)) return [];
  return JSON.parse(fse.readFileSync(SCHEDULE_FILE, "utf-8"));
}

function saveSchedule(task: ScheduledTask) {
  const schedules = loadSchedules();
  schedules.push(task);
  fse.writeFileSync(SCHEDULE_FILE, JSON.stringify(schedules, null, 2));
}

function listSchedules() {
  return loadSchedules();
}

function removeSchedule(id: string) {
  const schedules = loadSchedules().filter((task) => task.id !== id);
  fse.writeFileSync(SCHEDULE_FILE, JSON.stringify(schedules, null, 2));
}

export { saveSchedule, listSchedules, removeSchedule };
