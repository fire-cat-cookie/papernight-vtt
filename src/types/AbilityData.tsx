import { Bonus } from "./Bonus";

export interface AbilityData {
  score: number;
  proficient: boolean;
  score_adds: Bonus[];
  save_adds: Bonus[];
}
