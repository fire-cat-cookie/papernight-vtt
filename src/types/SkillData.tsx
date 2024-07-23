import { Ability } from "./Ability";
import { Bonus } from "./Bonus";

export default interface SkillData {
  ability: Ability;
  proficiency_multiplier: number;
  adds: Bonus[];
}
