import { Ability } from "../types/Ability";
import { CharData } from "../types/CharData";

export const initialCharData: CharData = {
  name: "",
  base_ability_scores: [
    {
      ability: Ability.str,
      score: 8,
    },
    {
      ability: Ability.dex,
      score: 8,
    },
    {
      ability: Ability.con,
      score: 8,
    },
    {
      ability: Ability.int,
      score: 8,
    },
    {
      ability: Ability.wis,
      score: 8,
    },
    {
      ability: Ability.cha,
      score: 8,
    },
  ],
  lineage: undefined,
  classes: [],
  background: undefined,
  custom_features: [],
  status: {
    hp_missing: 0,
    hp_temp: 0,
    inspiration: false,
    hp_reduction: 0,
    hit_dice_remaining: [],
  },
  firstClass: "",
};
