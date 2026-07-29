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
  base_ability_scores: [
    {
      ability: Ability.str;
      score: number;
    },
    {
      ability: Ability.dex;
      score: number;
    },
    {
      ability: Ability.con;
      score: number;
    },
    {
      ability: Ability.int;
      score: number;
    },
    {
      ability: Ability.wis;
      score: number;
    },
    {
      ability: Ability.cha;
      score: number;
    },
  ];
  lineage?: Lineage;
  classes: Class[];
  firstClass: string;
  background?: CharBackground;
  status: CharStatus;
  custom_features: Feature[];
}
