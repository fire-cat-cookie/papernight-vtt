import { Ability } from "./Ability";
import { CharStatus } from "./CharStatus";
import { CreatureSize } from "./CreatureSize";
import { Dice } from "./Dice";
import { Feature } from "./Feature";
import { Skill } from "./Skill";

/**
 * A complete representation of a character to be fed into a character sheet, designed to be read but not modified.
 */
export interface CharComposed {
  name: string;
  level: number;
  classLevel: {
    class: string;
    subclass: string;
    level: number;
  }[];
  lineage: string;
  sublineage: string;
  hp_max: number;
  hp_current: number;
  abilities: {
    ability: Ability;
    score: number;
    mod: number;
    save: number;
  }[];
  skills: {
    skill: Skill;
    mod: number;
    prof: number;
  }[];
  initiative: number;
  ac: number;
  hit_dice_total: Dice[];
  hit_dice_remaining: Dice[];
  speed: number;
  creatureType: string;
  size: CreatureSize;
  proficiency_bonus: number;
  features: { feature: Feature; source: string }[];
  status: CharStatus;
}
