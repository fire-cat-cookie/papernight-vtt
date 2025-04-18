import { Ability } from "../types/Ability";
import { Dice } from "../types/Dice";

export const Util = {
  ListDistinct: function (values: string[], separator: string): string {
    return Array.from(new Set(values)).join(separator);
  },

  AverageRoll: function (dice: Dice) {
    return (dice.sides / 2 + 0.5) * dice.amount;
  },

  AbilityIndex: function (ability: Ability) {
    switch (ability) {
      case Ability.str:
        return 0;
      case Ability.dex:
        return 1;
      case Ability.con:
        return 2;
      case Ability.int:
        return 3;
      case Ability.wis:
        return 4;
      case Ability.cha:
        return 5;
    }
  },

  Clamp: function (value: number, min: number, max: number) {
    return Math.max(min, Math.min(value, max));
  },

  Roll: function (amount: number, sides: number) {
    let result = 0;
    for (let i = 0; i < amount; i++) {
      result += Math.floor(Math.random() * sides + 1);
    }
    return result;
  },
};
