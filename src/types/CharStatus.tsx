import { Dice } from "./Dice";

export interface CharStatus {
  hp_missing: number;
  hp_temp: number;
  hp_reduction: number;
  hit_dice_remaining: Dice[];
  inspiration: boolean;
}
