import { ConditionalEffect } from "./ConditionalEffect";
import { DamageType } from "./DamageType";

export interface Feature {
  name: string;
  source: string;
  description: string;
  conditional_effects: ConditionalEffect[];
  resistances: DamageType[];
}
