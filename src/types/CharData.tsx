import { Ability } from "./Ability";
import { CharBackground } from "./CharBackground";
import { CharStatus } from "./CharStatus";
import { Class } from "./Class";
import { Feature } from "./Feature";
import { Lineage } from "./Lineage";

/**
 * The selected character options and status (current hit points, conditions, etc.) that make up a character
 */
export interface CharData {
  name: string;
  base_ability_scores: { ability: Ability; score: number }[];
  lineage?: Lineage;
  classes: Class[];
  firstClass: string;
  background?: CharBackground;
  status: CharStatus;
  custom_features: Feature[];
}
