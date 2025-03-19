import { CharData } from "../types/CharData.tsx";
import { CreatureSize } from "../types/CreatureSize.tsx";
import { Feature } from "../types/Feature.tsx";
import { getLineageData, getSpells } from "./GetStaticData.tsx";

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

  function clearLineage(charData: CharData, previousLineageName: string) {
    clearLanguages(previousLineageName, charData);
    clearSenses(previousLineageName, charData);
    clearAbilityBonuses(previousLineageName, charData);
    clearFeatures(previousLineageName, charData);
    clearSpells(previousLineageName, charData);
    charData.speed = 0;
    clearSpeed(previousLineageName, charData);
    charData.size = CreatureSize.None;
  }

  function setLineage(charData: CharData, lineage: string) {
    let lineageData = getLineageData(lineage);

    if (charData.sublineage) {
      clearLineage(charData, charData.sublineage);
    }
    charData.sublineage = "";
    clearLineage(charData, getLineageData(charData.lineage).name);

    charData.lineage = lineageData.name;
    setSize(lineageData, charData);
    setLineageLanguages(lineageData, charData);
    setSpeed(lineageData, charData);
    setLineageSenses(lineageData, charData);
    setLineageAbilityBonuses(lineageData, charData);
    setLineageFeatures(lineageData, charData);
  }

  function setSublineage(charData: CharData, sublineage: string) {
    let sublineageData = getLineageData(charData.lineage)?.sublineages?.find(
      (sublineageToFilter: any) => sublineageToFilter.name == sublineage
    );

    if (charData.sublineage) {
      clearLineage(charData, charData.sublineage);
    }

    charData.sublineage = sublineage;
    setSize(sublineageData, charData);
    setLineageLanguages(sublineageData, charData);
    setSpeed(sublineageData, charData);
    setLineageSenses(sublineageData, charData);
    setLineageAbilityBonuses(sublineageData, charData);
    setLineageFeatures(sublineageData, charData);
  }

  function setLineageSenses(lineageData: any, charData: CharData) {
    let senses: any = lineageData.senses;
    senses?.forEach((sense: any) => {
      charData.senses.push({
        name: sense.name,
        range: sense.range,
        source: lineageData.name,
      });
    });
    return charData;
  }

  function setLineageFeatures(lineageData: any, charData: CharData): CharData {
    let features: any = lineageData.features;
    features?.forEach((feature: any) => {
      addFeature(charData, feature, lineageData.name);
    });
    return charData;
  }

  function addFeature(charData: CharData, feature: Feature, source: string) {
    feature.source = source;
    charData.features.push(feature);
    feature.gainSpells?.spells?.forEach((spell: any) => {
      if (!spell.levelRequirement || charData.level >= spell.levelRequirement) {
        addSpell(spell.name, charData, source);
      }
    });
    return charData;
  }

  function addSpell(spellName: string, charData: CharData, source: string) {
    let spellData = getSpells();
    let spell: any = spellData.find((spell) => spell.name == spellName);
    if (spell) {
      spell.source = source;
      charData.spells.push(spell);
    }
  }

  function setLineageLanguages(lineageData: any, charData: CharData): CharData {
    let languages = lineageData.languages;
    languages?.forEach((lang: string) => {
      charData.languages.push({ language: lang, source: lineageData.name });
    });
    return charData;
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
        source: lineageData.name,
      });
    });
    charData.abilities = charDataAbilities;
    return charData;
  }

  function clearSpeed(source: string, charData: CharData) {
    charData.speed_adds = charData.speed_adds.filter((bonus) => bonus.source != source);
  }

  function clearSenses(source: string, charData: CharData) {
    charData.senses = charData.senses.filter((sense) => sense.source != source);
  }

  function clearFeatures(source: string, charData: CharData) {
    charData.features = charData.features.filter((feature) => feature.source != source);
  }

  function clearSpells(source: string, charData: CharData) {
    charData.spells = charData.spells.filter((spell) => spell.source != source);
  }

  function clearLanguages(source: string, charData: CharData) {
    charData.languages = charData.languages.filter((lang) => lang.source != source);
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
