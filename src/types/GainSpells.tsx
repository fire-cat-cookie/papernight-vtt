import { Formula } from "./Formula";
import { LimitedUse } from "./LimitedUse";

export interface GainSpells {
  fixed?: boolean;
  selected?: {
    name: string;
    limitedUse?: LimitedUse;
    upcastLevel?: number;
    requireLevel?: number;
  }[];
  spellList?: {
    source?: string;
    spellNames?: string[];
    spellLevel?: number;
    spellSchool?: string;
  };
  number?: number;
  variableNumber?: Formula;
  spellMod?: string;
}
