import { Spell } from "./Spell";

export default interface Spellcasting {
  spells: Spell[];
  casterType: "Full" | "Half" | "Third" | "Pact Magic";
}
