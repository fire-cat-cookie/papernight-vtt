import { Formula } from "./Formula";

export enum Recharge {
  longRest = "Long Rest",
  shortRest = "Short Rest",
  day = "Day",
  special = "Special",
}

export interface LimitedUse {
  uses: number;
  variableUses: Formula;
  recharge: Recharge;
}
