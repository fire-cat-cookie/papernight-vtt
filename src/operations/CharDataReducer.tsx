import { Ability } from "../types/Ability.tsx";
import { CharData } from "../types/CharData.tsx";
import { Feature } from "../types/Feature.tsx";
import { Skill } from "../types/Skill.tsx";
import { Subclass } from "../types/Subclass.tsx";
import { GameUtil } from "./GameUtil.tsx";
import * as GetStaticData from "./GetStaticData.tsx";

export type CharDataAction =
  | { type: "set-lineage"; lineage: string }
  | { type: "set-sublineage"; sublineage: string }
  | { type: "set-name"; name: string }
  | { type: "set-ability-score"; ability: Ability; value: number }
  | { type: "set-class-level"; className: string; level: number }
  | { type: "update-class-feature"; className: string; feature: Feature }
  | { type: "set-class-skills"; className: string; skills: Skill[] }
  | { type: "set-subclass"; className: string; subclass: string }
  | { type: "remove-class"; className: string }
  | { type: "add-spell"; spellName: string; className: string; featureName: string }
  | { type: "remove-spell"; spellName: string; className: string; featureName: string };

export function charDataReducer(charData: CharData, action: CharDataAction) {
  switch (action.type) {
    case "set-lineage":
      return setLineage(charData, action.lineage);
    case "set-sublineage":
      return setSublineage(charData, action.sublineage);
    case "set-name":
      return { ...charData, name: action.name };
    case "set-ability-score":
      return setAbilityScore(action.ability, action.value);
    case "set-class-level":
      return setClassLevel(charData, action.className, action.level);
    case "update-class-feature":
      return updateClassFeature(charData, action.className, action.feature);
    case "set-class-skills":
      return setClassSkills(charData, action.className, action.skills);
    case "set-subclass":
      return setSubclass(charData, action.className, action.subclass);
    case "remove-class":
      return removeClass(charData, action.className);
    case "add-spell":
      return addSpell(charData, action.spellName, action.className, action.featureName);
    case "remove-spell":
      return removeSpell(charData, action.spellName, action.className, action.featureName);
    default:
      return { ...charData };
  }

  function addSpell(charData: CharData, spellName: string, className: string, featureName: string) {
    let loadedSpell: any = GetStaticData.getSpell(spellName);
    return {
      ...charData,
      classes: charData.classes.map((c) =>
        c.name === className
          ? {
              ...c,
              features: c.features.map((f) =>
                f.name === featureName
                  ? { ...f, spellcasting: [...(f.spellcasting ?? []), loadedSpell] }
                  : f,
              ),
            }
          : c,
      ),
    };
  }

  function removeSpell(
    charData: CharData,
    spellName: string,
    className: string,
    featureName: string,
  ) {
    return {
      ...charData,
      classes: charData.classes.map((c) =>
        c.name === className
          ? {
              ...c,
              features: c.features.map((f) =>
                f.name === featureName
                  ? { ...f, spellcasting: f.spellcasting.filter((s) => s.name != spellName) }
                  : f,
              ),
            }
          : c,
      ),
    };
  }

  function setSubclass(charData: CharData, className: string, subclassName: string) {
    let loadedSubclass: any = GetStaticData.getSubclass(className, subclassName);
    let subclassData: Subclass = {
      name: loadedSubclass.name,
      features: loadedSubclass.features,
    };

    return {
      ...charData,
      classes: charData.classes.map((c) =>
        c.name === className ? { ...c, subclass: subclassData } : c,
      ),
    };
  }

  function updateClassFeature(charData: CharData, className: string, feature: Feature) {
    return {
      ...charData,
      classes: charData.classes.map((c) =>
        c.name === className
          ? {
              ...c,
              features: c.features.map((f) =>
                f.level == feature.level && f.name === feature.name ? feature : f,
              ),
            }
          : c,
      ),
    };
  }

  function setClassLevel(charData: CharData, className: string, level: number) {
    if (!charData.classes.find((c) => c.name == className)) {
      return addClass(charData, className, level);
    } else {
      return {
        ...charData,
        classes: charData.classes.map((c) => (c.name === className ? { ...c, level: level } : c)),
      };
    }
  }

  function addClass(charData: CharData, className: string, level: number) {
    let classData = GetStaticData.getClass(className);
    let newClass = {
      name: classData.name,
      level: level,
      hitDie: classData.hitdie,
      subclass: undefined,
      features: classData.features,
      savingThrowProf: classData.savingThrows,
      progression: classData.progression,
      armorProf: classData.armorProf,
      weaponProf: classData.weaponProf,
      toolProf: classData.toolProf,
      skills: { firstLevel: [], multiclass: [] },
      cantripsKnown: classData.cantripsKnown,
      spellsKnown: classData.spellsKnown,
    };
    return {
      ...charData,
      firstClass: charData.classes.length == 0 ? className : charData.firstClass,
      classes: [...charData.classes, newClass],
    };
  }

  function setClassSkills(charData: CharData, className: string, skills: Skill[]) {
    let multiclass = charData.classes.length > 1 && charData.classes[0].name != className;
    if (multiclass) {
      return {
        ...charData,
        classes: charData.classes.map((c) =>
          c.name === className ? { ...c, skills: { ...c.skills, multiclass: skills } } : c,
        ),
      };
    } else {
      return {
        ...charData,
        classes: charData.classes.map((c) =>
          c.name === className ? { ...c, skills: { ...c.skills, firstLevel: skills } } : c,
        ),
      };
    }
  }

  function setLineage(charData: CharData, lineage: string) {
    let lineageData = GetStaticData.getLineageData(lineage);
    let lineageParsed = charData.lineage;
    if (lineageData) {
      lineageParsed = {
        name: lineageData.name,
        speed: lineageData.speed,
        creatureType: lineageData.creature_type,
        size: lineageData.size,
        features: lineageData.features,
        sublineage: undefined,
      };
    }
    return { ...charData, lineage: lineageParsed };
  }

  function setSublineage(charData: CharData, sublineageName: string) {
    if (charData.lineage) {
      let sublineageData = GetStaticData.getLineageData(charData.lineage.name)?.sublineages?.find(
        (sublineage: any) => sublineage.name == sublineageName,
      );
      if (sublineageData) {
        return {
          ...charData,
          lineage: {
            ...charData.lineage,
            sublineage: { name: sublineageData.name, features: sublineageData.features },
          },
        };
      }
    }
    return charData;
  }

  function setAbilityScore(ability: Ability, value: number) {
    let index = GameUtil.AbilityFromIndex(ability);
    let newAbilities = charData.base_ability_scores.slice();
    newAbilities[index].score = value;
    return { ...charData, base_ability_scores: newAbilities };
  }

  function removeClass(charData: CharData, className: string) {
    let newCharData = { ...charData, classes: charData.classes.filter((c) => c.name != className) };
    if (newCharData.classes.length == 0) {
      newCharData.firstClass = "";
    }
    return newCharData;
  }
}
