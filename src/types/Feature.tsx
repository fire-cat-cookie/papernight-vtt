import { Bonus } from "./Bonus";
import { ConditionalEffect } from "./ConditionalEffect";
import { DamageType } from "./DamageType";
import { FeatureUpgrade } from "./FeatureUpgrade";
import { GainSpells } from "./GainSpells";
import { LimitedUse } from "./LimitedUse";
import { Sense } from "./Sense";
import { Skill } from "./Skill";

export interface Feature {
  level: number;
  name: string;
  description: string[];
  conditional_effects: ConditionalEffect[];
  resistances: DamageType[];
  gainSpells: GainSpells;
  bonuses: Bonus[];
  skillProf: {
    skill: Skill;
    expertise: boolean;
  }[];
  weaponProf: string[];
  armorProf: string[];
  toolProf: string[];
  languages: string[];
  senses: Sense[];
  abilityScoreImprovement: boolean;
  subclassFeature: boolean;
  limitedUse: LimitedUse;
  upgrades: FeatureUpgrade[];
}
