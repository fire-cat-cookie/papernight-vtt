import { AbilityData } from "./AbilityData";
import { Bonus } from "./Bonus";
import { CreatureSize } from "./CreatureSize";
import { HitDice } from "./HitDice";
import SkillData from "./SkillData";

export interface CharData {
  name: string;
  classLevel: string;
  lineage: string;
  initiative_adds: Bonus[];
  ac_adds: Bonus[];
  inspiration: boolean;
  hp: {
    current: number;
    max: number;
    temp: number;
    max_adds: Bonus[];
  };
  hitDice: HitDice[];
  conditions: string[];
  speed: number;
  speed_adds: Bonus[];
  creatureType: string;
  size: CreatureSize;
  senses: string[];
  proficiency_bonus: number;
  abilities: {
    str: AbilityData;
    dex: AbilityData;
    con: AbilityData;
    int: AbilityData;
    wis: AbilityData;
    cha: AbilityData;
  };
  skills: {
    acrobatics: SkillData;
    animal_handling: SkillData;
    arcana: SkillData;
    athletics: SkillData;
    deception: SkillData;
    history: SkillData;
    insight: SkillData;
    intimidation: SkillData;
    investigation: SkillData;
    medicine: SkillData;
    nature: SkillData;
    perception: SkillData;
    performance: SkillData;
    persuasion: SkillData;
    religion: SkillData;
    sleight_of_hand: SkillData;
    stealth: SkillData;
    survival: SkillData;
  };
  traits: string;
  inventory: string;
  languages: string;
  tool_prof: string;
  armor_weapon_prof: string;
}
