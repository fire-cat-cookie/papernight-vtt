import { LimitedUse } from "./LimitedUse";

export interface GainSpells {
  spells: {
    name: string;
    levelRequirement: number;
    limitedUse: LimitedUse;
  }[];
  spellMod: string;
}
