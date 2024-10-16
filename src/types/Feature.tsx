import { ConditionalEffect } from "./ConditionalEffect";

export interface Feature {
  name: string;
  source: string;
  description: string;
  conditional_effects: ConditionalEffect[];
}
