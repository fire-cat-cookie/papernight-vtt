import { Ability } from "./Ability";
import { CharStatus } from "./CharStatus";
import { CreatureSize } from "./CreatureSize";
import { Dice } from "./Dice";
import { Feature } from "./Feature";

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
  str_score: number;
  str_mod: number;
  str_save: number;
  dex_score: number;
  dex_mod: number;
  dex_save: number;
  con_score: number;
  con_mod: number;
  con_save: number;
  int_score: number;
  int_mod: number;
  int_save: number;
  wis_score: number;
  wis_mod: number;
  wis_save: number;
  cha_score: number;
  cha_mod: number;
  cha_save: number;
  abilities: {
    ability: Ability;
    score: number;
    mod: number;
    save: number;
  }[];
  skillMods: {
    acrobatics: number;
    animal_handling: number;
    arcana: number;
    athletics: number;
    deception: number;
    history: number;
    insight: number;
    intimidation: number;
    investigation: number;
    medicine: number;
    nature: number;
    perception: number;
    performance: number;
    persuasion: number;
    religion: number;
    sleight_of_hand: number;
    stealth: number;
    survival: number;
  };
  skillProf: {
    acrobatics: number;
    animal_handling: number;
    arcana: number;
    athletics: number;
    deception: number;
    history: number;
    insight: number;
    intimidation: number;
    investigation: number;
    medicine: number;
    nature: number;
    perception: number;
    performance: number;
    persuasion: number;
    religion: number;
    sleight_of_hand: number;
    stealth: number;
    survival: number;
  };
  initiative: number;
  ac: number;
  hit_dice_total: Dice[];
  speed: number;
  creatureType: string;
  size: CreatureSize;
  proficiency_bonus: number;
  features: { feature: Feature; source: string }[];
  status: CharStatus;
}
