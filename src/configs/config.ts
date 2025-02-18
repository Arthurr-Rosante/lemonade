import path from "path";
import os from "os";
import fse from "fs-extra";
import { Config } from "../types.js";

export const TEMP_FOLDER = process.env.TEMP!;

export const CONFIG_FOLDER = path.join(
  process.env.APPDATA || path.join(os.homedir(), ".config"),
  "lemonade-cli"
);

export const CONFIG_FILE = path.join(CONFIG_FOLDER, "config.json");

export const ensureConfigFile = () => {
  if (!fse.existsSync(CONFIG_FOLDER)) {
    fse.mkdirSync(CONFIG_FOLDER, { recursive: true });
  }

  if (!fse.existsSync(CONFIG_FILE)) {
    fse.writeFileSync(
      CONFIG_FILE,
      JSON.stringify(
        [
          {
            id: 1,
            name: "base",
            path: TEMP_FOLDER,
            active: true,
          },
        ],
        null,
        2
      ),
      "utf-8"
    );
  }
};

export const verifyConfigExists = (configs: Config[], name: string) => {
  if (configs.some((config) => config.name === name)) {
    return true;
  }
  return false;
};
