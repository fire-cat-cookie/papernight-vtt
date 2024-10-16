import { CreatureSize } from "../types/CreatureSize";
import { Ability } from "../types/Ability";
import { Language } from "../types/Language";
import { CharData } from "../types/CharData";

export const initialCharData: CharData = {
  name: "Amalia",
  classLevel: "3 Warlock (Archfey)",
  lineage: "Tiefling",
  initiative_adds: [],
  ac_adds: [{ flat: 3, dice: "", name: "Mage Armor" }],
  inspiration: false,
  hp: {
    current: 21,
    max: 21,
    temp: 0,
    max_adds: [],
  },
  hitDice: [
    {
      type: 8,
      remaining: 3,
      total: 3,
    },
  ],
  conditions: ["Stunned", "Paralyzed"],
  speed: 30,
  speed_adds: [],
  creatureType: "Humanoid",
  size: CreatureSize.Medium,
  senses: ["Darkvision 60ft."],
  proficiency_bonus: 2,
  abilities: {
    str: {
      score: 8,
      proficient: false,
      score_adds: [],
      save_adds: [],
    },
    dex: {
      score: 14,
      proficient: false,
      score_adds: [],
      save_adds: [],
    },
    con: {
      score: 12,
      proficient: false,
      score_adds: [],
      save_adds: [],
    },
    int: {
      score: 12,
      proficient: false,
      score_adds: [],
      save_adds: [],
    },
    wis: {
      score: 14,
      proficient: true,
      score_adds: [],
      save_adds: [],
    },
    cha: {
      score: 16,
      proficient: true,
      score_adds: [],
      save_adds: [],
    },
  },
  skills: {
    acrobatics: {
      ability: Ability.dex,
      proficiency_multiplier: 0,
      adds: [],
    },
    animal_handling: {
      ability: Ability.wis,
      proficiency_multiplier: 0,
      adds: [],
    },
    arcana: {
      ability: Ability.int,
      proficiency_multiplier: 1,
      adds: [],
    },
    athletics: {
      ability: Ability.str,
      proficiency_multiplier: 0,
      adds: [],
    },
    deception: {
      ability: Ability.cha,
      proficiency_multiplier: 2,
      adds: [],
    },
    history: {
      ability: Ability.int,
      proficiency_multiplier: 0,
      adds: [],
    },
    insight: {
      ability: Ability.wis,
      proficiency_multiplier: 0,
      adds: [],
    },
    intimidation: {
      ability: Ability.cha,
      proficiency_multiplier: 0,
      adds: [],
    },
    investigation: {
      ability: Ability.int,
      proficiency_multiplier: 0,
      adds: [],
    },
    medicine: {
      ability: Ability.wis,
      proficiency_multiplier: 0,
      adds: [],
    },
    nature: {
      ability: Ability.int,
      proficiency_multiplier: 0,
      adds: [],
    },
    perception: {
      ability: Ability.wis,
      proficiency_multiplier: 1,
      adds: [],
    },
    performance: {
      ability: Ability.cha,
      proficiency_multiplier: 0,
      adds: [],
    },
    persuasion: {
      ability: Ability.cha,
      proficiency_multiplier: 0,
      adds: [],
    },
    religion: {
      ability: Ability.int,
      proficiency_multiplier: 0,
      adds: [],
    },
    sleight_of_hand: {
      ability: Ability.dex,
      proficiency_multiplier: 0,
      adds: [],
    },
    stealth: {
      ability: Ability.dex,
      proficiency_multiplier: 1,
      adds: [],
    },
    survival: {
      ability: Ability.wis,
      proficiency_multiplier: 0,
      adds: [],
    },
  },
  features: [],

  traits: `Hellish Resistance: You have resistance to fire damage.

Winged Tiefling: You have a flying speed of 30 feet while you aren’t wearing heavy armor.

Fey Presence: Once per short rest, as an action, you can cause each creature in a 10-ft. cube from you to make a WIS saving throw (DC 13) or become charmed or frightened by you (your choice) until the end of your next turn.
  
Invocation - Armor of Shadows: You can cast mage armor on yourself at will, without expending a spell slot or material components.

Invocation - Agonizing Blast: When you cast eldritch blast, add +3 to the damage it deals on a hit.
  
----Spells----
Cantrips: Create Bonfire, Eldritch Blast, Mage Hand, Minor Illusion, Spare the Dying

At will: Mage Armor

2nd [2/2 Spell Slots]: Armor of Agathys, Charm Person, Shatter, Sleep
`,
  inventory: `15gp

Arcane Focus, Bedroll, Dagger (x2), Flute, Backpack, Crowbar, Hammer, Piton (x10), Rations (x10), Rope (50ft.), Tinderbox, Torch (x10), Waterskin`,
  languages: [{ language: "Common", source: "TestData" }],
  tool_prof: `Flute, Playing Card Set`,
  armor_weapon_prof: `Light Armor, Simple Weapons`,
};
