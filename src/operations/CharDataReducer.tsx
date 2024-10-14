import { CharData } from "../types/CharData.tsx";
import { CreatureSize } from "../types/CreatureSize.tsx";
import { getLineageData } from "./GetLineageData.tsx";

export type CharDataAction =
  | { type: "set-lineage"; lineage: string }
  | { type: "set-name"; name: string };

export function charDataReducer(charData: CharData, action: CharDataAction) {
  switch (action.type) {
    case "set-lineage":
      setLineage(charData, action.lineage);
      return { ...charData };
    case "set-name":
      charData.name = action.name;
      return { ...charData };
    default:
      return { ...charData };
  }

  function setLineage(charData: CharData, lineage: string) {
    let lineageData = getLineageData(lineage);
    charData.lineage = lineageData.name;
    charData = setSize(lineageData, charData);
    charData = setAbilityBonuses(lineageData, charData);
  }

  function setSize(lineageData: any, charData: CharData): CharData {
    let size = lineageData.size;
    if (!size) {
      charData.size = CreatureSize.Error;
    }
    charData.size = size;
    return charData;
  }

  function setAbilityBonuses(lineageData: any, charData: CharData): CharData {
    let lineageAbilities = lineageData.ability_scores;
    clearLineageAbilityBonuses(charData);
    if (!lineageAbilities) {
      return charData;
    }
    let charDataAbilities = charData.abilities;
    let charDataScoreAddsMap = new Map([
      ["Strength", charDataAbilities.str.score_adds],
      ["Dexterity", charDataAbilities.dex.score_adds],
      ["Constitution", charDataAbilities.con.score_adds],
      ["Intelligence", charDataAbilities.int.score_adds],
      ["Wisdom", charDataAbilities.wis.score_adds],
      ["Charisma", charDataAbilities.cha.score_adds],
    ]);
    lineageAbilities.forEach((ability: any) => {
      let charDataScoreAdds = charDataScoreAddsMap.get(ability.score);
      charDataScoreAdds?.push({
        flat: ability.bonus,
        dice: "",
        name: "Lineage",
      });
    });
    charData.abilities = charDataAbilities;
    return charData;
  }

  function clearLineageAbilityBonuses(charData: CharData): CharData {
    let abilities = charData.abilities;
    let abilityDataArray = [
      abilities.str,
      abilities.dex,
      abilities.con,
      abilities.int,
      abilities.wis,
      abilities.cha,
    ];
    abilityDataArray.forEach((ability) => {
      ability.score_adds = ability.score_adds.filter((scoreBonus) => {
        scoreBonus.name != "Lineage";
      });
    });
    return charData;
  }
}
