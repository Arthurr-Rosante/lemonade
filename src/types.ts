export interface IError {
  errno: number;
  code: string;
  syscall: string;
  path: string;
}

export interface CleanOpts {
  log?: boolean;
  path?: string | string[];
  // name?: string;
}

export type Status = {
  cleaned: string[];
  skipped: string[];
};
