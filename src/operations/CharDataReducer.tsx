import { CharData } from "../types/CharData.tsx";
import { Feature } from "../types/Feature.tsx";
import { getLineageData } from "./GetLineageData.tsx";

export type CharDataAction =
  | { type: "set-lineage"; lineage: string }
  | { type: "set-sublineage"; sublineage: string }
  | { type: "set-name"; name: string };

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
    default:
      return { ...charData };
  }

  function setLineage(charData: CharData, lineage: string) {
    let lineageData = getLineageData(lineage);
    let previousLineageName = getLineageData(charData.lineage).name;
    charData.lineage = lineageData.name;
    charData.sublineage = "";
    setSize(lineageData, charData);
    clearLanguages(previousLineageName, charData);
    setLineageLanguages(lineageData, charData);
    setSpeed(lineageData, charData);
    clearAbilityBonuses(previousLineageName, charData);
    setLineageAbilityBonuses(lineageData, charData);
    clearFeatures(previousLineageName, charData);
    setLineageFeatures(lineageData, charData);
  }

  function setSublineage(charData: CharData, sublineage: string) {
    let sublineageData = getLineageData(charData.lineage)?.sublineages?.find(
      (sublineageToFilter: any) => sublineageToFilter.name == sublineage
    );
    let previousSublineageName = charData.sublineage;
    charData.sublineage = sublineage;
    setSize(sublineageData, charData);
    clearLanguages(previousSublineageName, charData);
    setLineageLanguages(sublineageData, charData);
    setSpeed(sublineageData, charData);
    clearAbilityBonuses(previousSublineageName, charData);
    setLineageAbilityBonuses(sublineageData, charData);
    clearFeatures(previousSublineageName, charData);
    setLineageFeatures(sublineageData, charData);
  }

  function setLineageFeatures(lineageData: any, charData: CharData): CharData {
    let features: any = lineageData.features;
    features?.forEach((feature: any) => {
      addFeature(charData, feature, lineageData.name);
    });
    return charData;
  }

  function clearFeatures(source: string, charData: CharData) {
    charData.features = charData.features.filter((feature) => feature.source != source);
  }

  function addFeature(charData: CharData, feature: Feature, source: string) {
    feature.source = source;
    charData.features.push(feature);
    return charData;
  }

  function setLineageLanguages(lineageData: any, charData: CharData): CharData {
    let languages = lineageData.languages;
    languages?.forEach((lang: string) => {
      charData.languages.push({ language: lang, source: lineageData.name });
    });
    return charData;
  }

  function clearLanguages(source: string, charData: CharData) {
    charData.languages = charData.languages.filter((lang) => lang.source != source);
  }

  function setSize(lineageData: any, charData: CharData): CharData {
    let size = lineageData.size;
    if (size) {
      charData.size = size;
    }
    return charData;
  }

  function setSpeed(lineageData: any, charData: CharData): CharData {
    let speed = lineageData.speed;
    if (speed) {
      charData.speed = speed;
    }
    return charData;
  }

  function setLineageAbilityBonuses(lineageData: any, charData: CharData): CharData {
    let lineageAbilities = lineageData.ability_scores;
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
        name: lineageData.name,
      });
    });
    charData.abilities = charDataAbilities;
    return charData;
  }

  function clearAbilityBonuses(source: string, charData: CharData): CharData {
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
      ability.score_adds = ability.score_adds.filter((scoreBonus) => scoreBonus.name != source);
    });
    return charData;
  }
}
