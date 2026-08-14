import { CastingTime } from "./CastingTime";

export interface Spell {
  name: string;
  level: number;
  school: string;
  castingTime: CastingTime;
  range: string;
  components: string;
  cost: boolean;
  duration: string;
  ritual: boolean;
  description: string[];
  source: string;
}
