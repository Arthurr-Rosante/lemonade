export interface CleanOpts {
  showLog?: boolean;
}

export interface ScheduleOpts {
  name: string;
  days: number[];
  hour: number;
  default?: boolean;
}
