export interface IError {
  errno: number;
  code: string;
  syscall: string;
  path: string;
}

export interface Config {
  id: number;
  name: string;
  path: string;
  active: boolean;
}

export interface CleanOpts {
  log?: boolean;
  path?: string | string[];
  name?: string;
}

export type Status = {
  cleaned: string[];
  skipped: string[];
};
