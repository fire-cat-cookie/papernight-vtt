import { Ability } from "../types/Ability";
import { CharData } from "../types/CharData";

export const initialCharData: CharData = {
  name: "",
  level: 1,
  base_ability_scores: [
    {
      ability: Ability.str,
      score: 0,
    },
    {
      ability: Ability.dex,
      score: 0,
    },
    {
      ability: Ability.con,
      score: 0,
    },
    {
      ability: Ability.int,
      score: 0,
    },
    {
      ability: Ability.wis,
      score: 0,
    },
    {
      ability: Ability.cha,
      score: 0,
    },
  ],
  lineage: undefined,
  classes: [],
  background: undefined,
  custom_features: [],
  status: {
    hp_current: 0,
    hp_temp: 0,
    inspiration: false,
    hp_reduction: 0,
    hit_dice_remaining: [],
  },
  firstClass: "",
};
