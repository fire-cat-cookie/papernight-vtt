import { Ability } from "../types/Ability";
import { Bonus, Target } from "../types/Bonus";
import { CharComposed } from "../types/CharComposed";
import { CharData } from "../types/CharData";
import { Class } from "../types/Class";
import { CreatureSize } from "../types/CreatureSize";
import { Dice } from "../types/Dice";
import { Feature } from "../types/Feature";
import { Skill } from "../types/Skill";
import { SkillProf } from "../types/SkillProf";
import { GameUtil } from "./GameUtil";

export function ComposeChar(charData: CharData): CharComposed {
  return {
    name: charData.name,
    level: level(charData),
    classLevel: classLevel(charData),
    lineage: charData.lineage ? charData.lineage.name : "",
    sublineage: charData.lineage?.sublineage ? charData.lineage.sublineage.name : "",
    str_score: abilityScore(charData, Ability.str),
    str_mod: abilityMod(charData, Ability.str),
    str_save: savingThrowMod(charData, Ability.str),
    dex_score: abilityScore(charData, Ability.dex),
    dex_mod: abilityMod(charData, Ability.dex),
    dex_save: savingThrowMod(charData, Ability.dex),
    con_score: abilityScore(charData, Ability.con),
    con_mod: abilityMod(charData, Ability.con),
    con_save: savingThrowMod(charData, Ability.con),
    int_score: abilityScore(charData, Ability.int),
    int_mod: abilityMod(charData, Ability.int),
    int_save: savingThrowMod(charData, Ability.int),
    wis_score: abilityScore(charData, Ability.wis),
    wis_mod: abilityMod(charData, Ability.wis),
    wis_save: savingThrowMod(charData, Ability.wis),
    cha_score: abilityScore(charData, Ability.cha),
    cha_mod: abilityMod(charData, Ability.cha),
    cha_save: savingThrowMod(charData, Ability.cha),
    abilities: [
      {
        ability: Ability.str,
        score: abilityScore(charData, Ability.str),
        mod: abilityMod(charData, Ability.str),
        save: savingThrowMod(charData, Ability.str),
      },
      {
        ability: Ability.dex,
        score: abilityScore(charData, Ability.dex),
        mod: abilityMod(charData, Ability.dex),
        save: savingThrowMod(charData, Ability.dex),
      },
      {
        ability: Ability.con,
        score: abilityScore(charData, Ability.con),
        mod: abilityMod(charData, Ability.con),
        save: savingThrowMod(charData, Ability.con),
      },
      {
        ability: Ability.int,
        score: abilityScore(charData, Ability.int),
        mod: abilityMod(charData, Ability.int),
        save: savingThrowMod(charData, Ability.int),
      },
      {
        ability: Ability.wis,
        score: abilityScore(charData, Ability.wis),
        mod: abilityMod(charData, Ability.wis),
        save: savingThrowMod(charData, Ability.wis),
      },
      {
        ability: Ability.cha,
        score: abilityScore(charData, Ability.cha),
        mod: abilityMod(charData, Ability.cha),
        save: savingThrowMod(charData, Ability.cha),
      },
    ],
    skillMods: {
      acrobatics: skillMod(charData, Skill.acrobatics),
      animal_handling: skillMod(charData, Skill.animal_handling),
      arcana: skillMod(charData, Skill.arcana),
      athletics: skillMod(charData, Skill.athletics),
      deception: skillMod(charData, Skill.deception),
      history: skillMod(charData, Skill.history),
      insight: skillMod(charData, Skill.insight),
      intimidation: skillMod(charData, Skill.intimidation),
      investigation: skillMod(charData, Skill.investigation),
      medicine: skillMod(charData, Skill.medicine),
      nature: skillMod(charData, Skill.nature),
      perception: skillMod(charData, Skill.perception),
      performance: skillMod(charData, Skill.performance),
      persuasion: skillMod(charData, Skill.persuasion),
      religion: skillMod(charData, Skill.religion),
      sleight_of_hand: skillMod(charData, Skill.sleight_of_hand),
      stealth: skillMod(charData, Skill.stealth),
      survival: skillMod(charData, Skill.survival),
    },
    skillProf: {
      acrobatics: skillProf(charData, Skill.acrobatics),
      animal_handling: skillProf(charData, Skill.animal_handling),
      arcana: skillProf(charData, Skill.arcana),
      athletics: skillProf(charData, Skill.athletics),
      deception: skillProf(charData, Skill.deception),
      history: skillProf(charData, Skill.history),
      insight: skillProf(charData, Skill.insight),
      intimidation: skillProf(charData, Skill.intimidation),
      investigation: skillProf(charData, Skill.investigation),
      medicine: skillProf(charData, Skill.medicine),
      nature: skillProf(charData, Skill.nature),
      perception: skillProf(charData, Skill.perception),
      performance: skillProf(charData, Skill.performance),
      persuasion: skillProf(charData, Skill.persuasion),
      religion: skillProf(charData, Skill.religion),
      sleight_of_hand: skillProf(charData, Skill.sleight_of_hand),
      stealth: skillProf(charData, Skill.stealth),
      survival: skillProf(charData, Skill.survival),
    },
    hp_max: maxHP(charData),
    hp_current: Math.max(0, maxHP(charData) - charData.status.hp_missing),
    initiative: initiative(charData),
    ac: AC(charData),
    hit_dice_total: hitDice(charData),
    speed: speed(charData),
    creatureType: charData.lineage ? charData.lineage.creatureType : "",
    size: charData.lineage ? charData.lineage.size : CreatureSize.None,
    proficiency_bonus: proficiencyBonus(charData),
    features: allFeatures(charData),
    status: charData.status,
  };
}

function level(charData: CharData): number {
  let level = 0;
  for (let class_ of charData.classes) {
    level += class_.level;
  }
  return level;
}

function speed(charData: CharData): number {
  let result = 0;
  if (charData.lineage) {
    result = charData.lineage.speed;
  }
  let bonuses = allBonuses(charData).filter((b) => b.target == Target.speed);
  bonuses.forEach((b) => (result += b.flat));
  return result;
}

function hitDice(charData: CharData): Dice[] {
  let result: Dice[] = [];
  for (let class_ of charData.classes) {
    result.push({
      amount: class_.level,
      sides: class_.hitDie,
    });
  }
  return result;
}

function maxHP(charData: CharData) {
  let result = 0;
  let firstClass_ = firstClass(charData);
  if (firstClass_) {
    result += firstClass_.hitDie;
  }
  for (let class_ of charData.classes) {
    let start = class_ == firstClass_ ? 1 : 0;
    for (let i = start; i < class_.level; i++) {
      result += Math.round(GameUtil.AverageRoll({ amount: 1, sides: class_.hitDie }));
    }
  }
  result += abilityMod(charData, Ability.con) * level(charData);
  let bonuses = allBonuses(charData).filter((b) => b.target == Target.hp);
  bonuses.forEach((b) => (result += b.flat));
  if (charData.status?.hp_reduction) {
    result -= charData.status.hp_reduction;
  }
  return Math.max(0, result);
}

function classLevel(charData: CharData) {
  let classLevel: any[] = [];
  for (let c of charData.classes) {
    classLevel.push({
      class: c.name,
      subclass: c.subclass ? c.subclass.name : "",
      level: c.level,
    });
  }
  return classLevel;
}

function allBonuses(charData: CharData) {
  let result: Bonus[] = [];
  for (let feature of allFeatures(charData)) {
    if (feature.bonuses) {
      result.push(...feature.bonuses);
    }
  }
  return result;
}

function allFeatures(charData: CharData) {
  let result: Feature[] = [];
  if (charData.lineage) {
    if (charData.lineage.features) {
      result.push(...charData.lineage.features);
    }
    if (charData.lineage.sublineage && charData.lineage.sublineage.features) {
      result.push(...charData.lineage.sublineage.features);
    }
  }
  if (charData.classes) {
    for (let class_ of charData.classes) {
      if (class_.features) {
        result.push(...class_.features);
      }
      if (class_.subclass && class_.subclass.features) {
        result.push(...class_.subclass.features);
      }
    }
  }
  if (charData.background && charData.background.features) {
    result.push(...charData.background.features);
  }
  if (charData.custom_features) {
    result.push(...charData.custom_features);
  }
  return result;
}

function initiative(charData: CharData) {
  let result = abilityMod(charData, Ability.dex);
  let bonuses = allBonuses(charData).filter((b) => b.target == Target.initiative);
  bonuses.forEach((b) => (result += b.flat));
  return result;
}

function AC(charData: CharData) {
  let result = abilityMod(charData, Ability.dex);
  let bonuses = allBonuses(charData).filter((b) => b.target == Target.ac);
  bonuses.forEach((b) => (result += b.flat));
  return 10 + result;
}

function abilityScore(charData: CharData, abilityType: Ability) {
  let result = 0;
  let base_score = charData.base_ability_scores.find((a) => a.ability == abilityType)?.score;
  if (base_score) {
    result += base_score;
  }
  let target: Target = targetAbilityScore(abilityType);
  let bonuses = allBonuses(charData)?.filter((bonus) => bonus.target == target);
  bonuses.forEach((b) => (result += b.flat));
  return result;
}

function targetAbilityScore(ability: Ability): Target {
  switch (ability) {
    case Ability.str:
      return Target.str_score;
    case Ability.con:
      return Target.con_score;
    case Ability.dex:
      return Target.dex_score;
    case Ability.int:
      return Target.int_score;
    case Ability.wis:
      return Target.wis_score;
    case Ability.cha:
      return Target.cha_score;
  }
}

function abilityMod(charData: CharData, ability: Ability) {
  let score = abilityScore(charData, ability);
  let mod = 0;
  if (score <= 8) {
    mod = Math.ceil(Math.abs(10 - score) / 2) * -1;
  } else if (score >= 12) {
    mod = Math.floor((score - 10) / 2);
  }
  return mod;
}

function firstClass(charData: CharData): Class | undefined {
  return charData.classes.find((c) => c.name == charData.firstClass);
}

function savingThrowMod(charData: CharData, ability: Ability) {
  let proficiency = false;
  if (firstClass(charData) && firstClass(charData)?.savingThrowProf.indexOf(ability) != -1) {
    proficiency = true;
  }
  let target = targetSavingThrow(ability);
  let result = abilityMod(charData, ability);
  if (proficiency) {
    result += proficiencyBonus(charData);
  }
  let bonuses = allBonuses(charData).filter((b) => b.target == target);
  bonuses.forEach((b) => (result += b.flat));
  return result;
}

function targetSavingThrow(ability: Ability): Target {
  switch (ability) {
    case Ability.str:
      return Target.str_save;
    case Ability.con:
      return Target.con_save;
    case Ability.dex:
      return Target.dex_save;
    case Ability.int:
      return Target.int_save;
    case Ability.wis:
      return Target.wis_save;
    case Ability.cha:
      return Target.cha_save;
  }
}

function proficiencyBonus(charData: CharData) {
  let charLevel = level(charData);
  if (charLevel >= 17) {
    return 6;
  } else if (charLevel >= 13) {
    return 5;
  } else if (charLevel >= 9) {
    return 4;
  } else if (charLevel >= 5) {
    return 3;
  } else {
    return 2;
  }
}

function skillMod(charData: CharData, skill: Skill) {
  let result = 0;
  let proficiencyMultiplier = skillProf(charData, skill);
  result += abilityMod(charData, skillAbilityMod(skill));
  result += proficiencyMultiplier * proficiencyBonus(charData);
  let bonuses = allBonuses(charData).filter((b) => b.target == targetSkill(skill));
  bonuses.forEach((b) => (result += b.flat));
  return result;
}

function skillProf(charData: CharData, skill: Skill): number {
  let proficiencyMultiplier = 0;
  let skillProficiencies: SkillProf[] = [];
  for (let c of charData.classes) {
    if (charData.firstClass == c.name) {
      skillProficiencies.push(
        ...c.skills.firstLevel.map((s) => {
          return { skill: s, expertise: false };
        })
      );
    } else if (c.skills.multiclass) {
      skillProficiencies.push(
        ...c.skills.multiclass.map((s) => {
          return { skill: s, expertise: false };
        })
      );
    }
  }
  for (let f of allFeatures(charData)) {
    if (f.skillProf) {
      skillProficiencies.push(...f.skillProf);
    }
  }
  for (let s of skillProficiencies.filter((s) => s.skill == skill)) {
    proficiencyMultiplier = 1;
    if (s.expertise) {
      return 2;
    }
  }
  return proficiencyMultiplier;
}

function targetSkill(skill: Skill) {
  switch (skill) {
    case Skill.acrobatics:
      return Target.acrobatics;
    case Skill.animal_handling:
      return Target.animal_handling;
    case Skill.arcana:
      return Target.arcana;
    case Skill.athletics:
      return Target.athletics;
    case Skill.deception:
      return Target.deception;
    case Skill.history:
      return Target.history;
    case Skill.insight:
      return Target.insight;
    case Skill.intimidation:
      return Target.intimidation;
    case Skill.investigation:
      return Target.investigation;
    case Skill.medicine:
      return Target.medicine;
    case Skill.nature:
      return Target.nature;
    case Skill.perception:
      return Target.perception;
    case Skill.performance:
      return Target.performance;
    case Skill.persuasion:
      return Target.persuasion;
    case Skill.religion:
      return Target.religion;
    case Skill.sleight_of_hand:
      return Target.sleight_of_hand;
    case Skill.stealth:
      return Target.stealth;
    case Skill.survival:
      return Target.survival;
  }
}

function skillAbilityMod(skill: Skill) {
  switch (skill) {
    case Skill.acrobatics:
      return Ability.dex;
    case Skill.animal_handling:
      return Ability.wis;
    case Skill.arcana:
      return Ability.int;
    case Skill.athletics:
      return Ability.str;
    case Skill.deception:
      return Ability.cha;
    case Skill.history:
      return Ability.int;
    case Skill.insight:
      return Ability.wis;
    case Skill.intimidation:
      return Ability.cha;
    case Skill.investigation:
      return Ability.int;
    case Skill.medicine:
      return Ability.wis;
    case Skill.nature:
      return Ability.int;
    case Skill.perception:
      return Ability.wis;
    case Skill.performance:
      return Ability.cha;
    case Skill.persuasion:
      return Ability.cha;
    case Skill.religion:
      return Ability.int;
    case Skill.sleight_of_hand:
      return Ability.dex;
    case Skill.stealth:
      return Ability.dex;
    case Skill.survival:
      return Ability.wis;
  }
}
