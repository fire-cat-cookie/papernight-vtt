import { ConditionalEffect } from "./ConditionalEffect";
import { DamageType } from "./DamageType";
import { GainSpells } from "./GainSpells";

export interface Feature {
  name: string;
  source: string;
  description: string;
  conditional_effects: ConditionalEffect[];
  resistances: DamageType[];
  gainSpells: GainSpells;
}
