import { Ability } from "./Ability";
import { Feature } from "./Feature";
import { Subclass } from "./Subclass";

export interface Class {
  name: string;
  level: number;
  hitDie: number;
  subclass: Subclass | undefined;
  features: Feature[];
  savingThrowProf: Ability[];
  progression: { name: string; entries: string[] | number[] }[];
}
