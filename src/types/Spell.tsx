import { CastingTime } from "./CastingTime";

export interface Spell {
  name: string;
  casting_time: CastingTime;
  level: number;
  info: string;
  description: string;
  source: string;
}
