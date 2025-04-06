import { CreatureSize } from "./CreatureSize";
import { Feature } from "./Feature";
import { Sublineage } from "./Sublineage";

export interface Lineage {
  name: string;
  speed: number;
  creatureType: string;
  size: CreatureSize;
  features: Feature[];
  sublineage?: Sublineage;
}
