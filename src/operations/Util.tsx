import { Ability } from "../types/Ability";
import { Target } from "../types/Bonus";
import { Dice } from "../types/Dice";

export const Util = {
  ListDistinct: function (values: string[], separator: string): string {
    return Array.from(new Set(values)).join(separator);
  },

  AverageRoll: function (dice: Dice) {
    return (dice.sides / 2 + 0.5) * dice.amount;
  },
};
