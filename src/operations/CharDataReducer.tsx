import { Ability } from "../types/Ability.tsx";
import { CharData } from "../types/CharData.tsx";
import { getLineageData } from "./GetStaticData.tsx";
import { Util } from "./Util.tsx";

export type CharDataAction =
  | { type: "set-lineage"; lineage: string }
  | { type: "set-sublineage"; sublineage: string }
  | { type: "set-name"; name: string }
  | { type: "set-ability-score"; ability: Ability; value: number };

export function charDataReducer(charData: CharData, action: CharDataAction) {
  switch (action.type) {
    case "set-lineage":
      setLineage(charData, action.lineage);
      return { ...charData };
    case "set-sublineage":
      setSublineage(charData, action.sublineage);
      return { ...charData };
    case "set-name":
      charData.name = action.name;
      return { ...charData };
    case "set-ability-score":
      charData.base_ability_scores[Util.AbilityIndex(action.ability)].score = action.value;
      console.log(charData);
      return { ...charData };
    default:
      return { ...charData };
  }

  function setLineage(charData: CharData, lineage: string) {
    charData.lineage = undefined;
    let lineageData = getLineageData(lineage);
    if (lineageData) {
      charData.lineage = {
        name: lineageData.name,
        speed: lineageData.speed,
        creatureType: lineageData.creature_type,
        size: lineageData.size,
        features: lineageData.features,
        sublineage: undefined,
      };
    }
  }

  function setSublineage(charData: CharData, sublineageName: string) {
    if (charData.lineage) {
      let sublineageData = getLineageData(charData.lineage.name)?.sublineages?.find(
        (sublineage: any) => sublineage.name == sublineageName
      );
      if (sublineageData) {
        charData.lineage.sublineage = {
          name: sublineageData.name,
          features: sublineageData.features,
        };
      }
    }
  }
}
