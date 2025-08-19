import React from "react";
import { Ability } from "../types/Ability";
import { Target } from "../types/Bonus";
import { Dice } from "../types/Dice";
import { Feature } from "../types/Feature";
import { CharComposed } from "../types/CharComposed";
import { Util } from "./Util";

export const GameUtil = {
  FeatureText_ASI:
    "Increase one ability score by 2, or two ability scores by 1, to a maximum of 20. Alternatively, pick a feat for which you qualify." as const,
  FeatureText_Darkvision:
    "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can’t discern color in darkness, only shades of gray." as const,

  Roll: function (amount: number, sides: number) {
    let result = 0;
    for (let i = 0; i < amount; i++) {
      result += Math.floor(Math.random() * sides + 1);
    }
    return result;
  },

  AverageRoll: function (dice: Dice) {
    return (dice.sides / 2 + 0.5) * dice.amount;
  },

  AbilityFromIndex: function (ability: Ability) {
    switch (ability) {
      case Ability.str:
        return 0;
      case Ability.dex:
        return 1;
      case Ability.con:
        return 2;
      case Ability.int:
        return 3;
      case Ability.wis:
        return 4;
      case Ability.cha:
        return 5;
    }
  },

  TargetFromAbilityScore: function (ability: Ability) {
    switch (ability) {
      case Ability.str:
        return Target.str_score;
      case Ability.dex:
        return Target.dex_score;
      case Ability.con:
        return Target.con_score;
      case Ability.int:
        return Target.int_score;
      case Ability.wis:
        return Target.wis_score;
      case Ability.cha:
        return Target.cha_score;
    }
  },

  AbilityFromTarget: function (target: Target) {
    switch (target) {
      case Target.str_score:
        return Ability.str;
      case Target.dex_score:
        return Ability.dex;
      case Target.con_score:
        return Ability.con;
      case Target.int_score:
        return Ability.int;
      case Target.wis_score:
        return Ability.wis;
      case Target.cha_score:
        return Ability.cha;
    }
  },

  DisplayFeatureDescription: function (feature: Feature, includeSubFeatures: boolean) {
    let description = this.GetFeatureDescription(feature);
    if (description == undefined) {
      return null;
    }
    return (
      <React.Fragment>
        <p className="builder-feature-text">
          {description.map((line: string, index: number) => (
            <React.Fragment key={index}>
              {line}
              <br></br>
            </React.Fragment>
          ))}
        </p>
        {includeSubFeatures &&
          feature.choices &&
          feature.choices.selected
            ?.filter((f) => f != undefined)
            .map((f) => (
              <React.Fragment key={f.name}>
                <br></br>
                <p>{f.name}</p>
                {feature && this.DisplayFeatureDescription(f, false)}
              </React.Fragment>
            ))}
      </React.Fragment>
    );
  },

  GetFeatureDescription: function (feature: Feature): string[] {
    let result = [""];
    if (feature.description) {
      return feature.description;
    }
    if (feature.name == "Ability Scores") {
      for (let i = 0; i < feature.bonuses.length; i++) {
        if (i > 0) result[0] += ", ";
        result[0] +=
          "+" +
          feature.bonuses[i].flat +
          " " +
          GameUtil.AbilityFromTarget(feature.bonuses[i].target);
      }
    } else if (feature.name == "Languages") {
      for (let i = 0; i < feature.languages.length; i++) {
        if (i > 0) result[0] += ", ";
        result[0] += feature.languages[i];
      }
    } else if (feature.name == "Darkvision") {
      result[0] = this.FeatureText_Darkvision;
    } else if (feature.name == "Ability Score Improvement") {
      result[0] = this.FeatureText_ASI;
    }
    return result;
  },
};
