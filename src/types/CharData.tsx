import { AbilityData } from "./AbilityData";
import { Bonus } from "./Bonus";
import { CreatureSize } from "./CreatureSize";
import { Feature } from "./Feature";
import { HitDice } from "./HitDice";
import { Language } from "./Language";
import { Sense } from "./Sense";
import SkillData from "./SkillData";
import { Spell } from "./Spell";

export interface CharData {
  name: string;
  level: number;
  classLevel: string;
  lineage: string;
  sublineage: string;
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
  senses: Sense[];
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
  features: Feature[];
  traits: string;
  inventory: string;
  languages: Language[];
  tool_prof: string;
  armor_weapon_prof: string;
  spells: Spell[];
}
