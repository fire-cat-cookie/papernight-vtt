import { Ability } from "./Ability";
import { CharBackground } from "./CharBackground";
import { CharStatus } from "./CharStatus";
import { Class } from "./Class";
import { Feature } from "./Feature";
import { Lineage } from "./Lineage";

export interface CharData {
  name: string;
  level: number;
  base_ability_scores: {
    ability: Ability;
    score: number;
  }[];
  lineage?: Lineage;
  classes: Class[];
  firstClass: string;
  background?: CharBackground;
  status: CharStatus;
  custom_features: Feature[];
}
