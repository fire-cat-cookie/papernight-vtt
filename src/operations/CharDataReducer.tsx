import { Ability } from "../types/Ability.tsx";
import { CharData } from "../types/CharData.tsx";
import { Feature } from "../types/Feature.tsx";
import { GameUtil } from "./GameUtil.tsx";
import { getClass, getLineageData } from "./GetStaticData.tsx";

export type CharDataAction =
  | { type: "set-lineage"; lineage: string }
  | { type: "set-sublineage"; sublineage: string }
  | { type: "set-name"; name: string }
  | { type: "set-ability-score"; ability: Ability; value: number }
  | { type: "set-class-level"; className: string; level: number }
  | { type: "update-class-feature"; className: string; feature: Feature }
  | { type: "remove-class"; className: string };

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
      charData.base_ability_scores[GameUtil.AbilityFromIndex(action.ability)].score = action.value;
      return { ...charData };
    case "set-class-level":
      setClassLevel(charData, action.className, action.level);
      return { ...charData };
    case "update-class-feature":
      updateClassFeature(charData, action.className, action.feature);
      return { ...charData };
    case "remove-class":
      charData.classes = charData.classes.filter((c) => c.name != action.className);
      if (charData.classes.length == 0) {
        charData.firstClass = "";
      }
      return { ...charData };
    default:
      return { ...charData };
  }

  function updateClassFeature(charData: CharData, className: string, feature: Feature) {
    let newClasses = charData.classes.slice();
    let newClass = charData.classes.find((c) => c.name == className);
    let newFeatures = newClass?.features?.filter(
      (f) => !(f.level == feature.level && f.name == feature.name)
    );
    newFeatures?.push(feature);
    if (newClass && newFeatures) {
      newClass.features = newFeatures;
      newClasses = newClasses.filter((c) => c.name != className);
      newClasses.push(newClass);
    }
    charData.classes = newClasses;
  }

  function setClassLevel(charData: CharData, className: string, level: number) {
    if (!charData.classes.find((c) => c.name == className)) {
      addClass(charData, className, level);
    } else {
      for (let i = 0; i < charData.classes.length; i++) {
        if (charData.classes[i].name == className) {
          charData.classes[i].level = level;
        }
      }
    }
  }

  function addClass(charData: CharData, className: string, level: number) {
    let classData = getClass(className);
    charData.classes.push({
      name: classData.name,
      level: level,
      hitDie: classData.hitdie,
      subclass: undefined,
      features: classData.features,
      savingThrowProf: classData.savingThrows,
    });
    if (charData.classes.length == 1) {
      charData.firstClass = className;
    }
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
