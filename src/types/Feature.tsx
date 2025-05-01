import { Bonus } from "./Bonus";
import { ConditionalEffect } from "./ConditionalEffect";
import { DamageType } from "./DamageType";
import { GainSpells } from "./GainSpells";
import { Sense } from "./Sense";
import { Skill } from "./Skill";

export interface Feature {
  level: number;
  name: string;
  source: string;
  description: string[];
  conditional_effects: ConditionalEffect[];
  resistances: DamageType[];
  gainSpells: GainSpells;
  bonuses: Bonus[];
  skillProf: {
    skill: Skill;
    proficiencyMultiplier: number; // 0 = not proficient, 1 = proficient, 2 = expertise
  }[];
  languages: string[];
  senses: Sense[];
  abilityScoreImprovement: boolean;
  subclassFeature: boolean;
}
