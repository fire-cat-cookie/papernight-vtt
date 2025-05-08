import { Ability } from "./Ability";
import { Feature } from "./Feature";
import { Skill } from "./Skill";
import { Subclass } from "./Subclass";

export interface Class {
  name: string;
  level: number;
  hitDie: number;
  subclass: Subclass | undefined;
  features: Feature[];
  savingThrowProf: Ability[];
  progression: { name: string; entries: string[] | number[] }[];
  armorProf: { firstLevel: string[]; multiclass?: string[] } | undefined;
  weaponProf: { firstLevel: string[]; multiclass?: string[] } | undefined;
  toolProf: { firstLevel: string[]; multiclass?: string[] } | undefined;
  skills: {
    firstLevel: Skill[];
    multiclass?: Skill[];
  };
}
