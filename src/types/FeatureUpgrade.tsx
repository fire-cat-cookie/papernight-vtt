import { Feature } from "./Feature";

export interface FeatureUpgrade extends Feature {
  upgradeLevel: number;
  upgradeName: string;
  inheritDescription: boolean;
}
