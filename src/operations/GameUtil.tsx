import React from "react";
import { Ability } from "../types/Ability";
import { Target } from "../types/Bonus";
import { Dice } from "../types/Dice";
import { Feature } from "../types/Feature";
import { CharComposed } from "../types/CharComposed";
import { Requirement } from "../types/Requirement";

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
        {GameUtil.DisplayMarkdown(description)}
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

  GroupDiceByType: function (dice: Dice[]): Dice[] {
    let result: Dice[] = [];

    let diceGrouped: Map<number, number> = new Map();

    for (let die of dice) {
      diceGrouped.set(die.sides, (diceGrouped.get(die.sides) ?? 0) + die.amount);
    }
    for (let die of diceGrouped.entries()) {
      result.push({ amount: die[1], sides: die[0] });
    }
    return result;
  },

  CheckRequirements: function (char: CharComposed, feature: Feature): boolean {
    let missingRequirements = feature.requirements?.filter(
      (r) => !GameUtil.CheckRequirement(char, r),
    );
    return !feature.requirements || missingRequirements.length == 0;
  },

  CheckRequirement: function (char: CharComposed, r: Requirement): boolean {
    switch (r.type) {
      case "feature":
        if (char.features.map((f) => f.feature.name).indexOf(r.value) == -1) {
          return false;
        }
        break;
      case "level":
        if (char.level < r.value) {
          return false;
        }
        break;
      case "spell":
        return false;
      case "choice":
        let choiceFeature = char.features.find((f) => f.feature.name == r.value.feature)?.feature;
        let selectedChoices = choiceFeature?.choices?.selected;
        if (
          selectedChoices == undefined ||
          !selectedChoices.find((choice: Feature) => choice?.name == r.value.choice)
        ) {
          return false;
        }
    }
    return true;
  },

  DisplayRequirement: function (r: Requirement): string {
    switch (r.type) {
      case "feature":
        return "Feature: " + r.value;
      case "level":
        return "Level: " + r.value;
      case "spell":
        return "Spell: " + r.value;
      case "choice":
        return r.value.feature + ": " + r.value.choice;
    }
  },

  DisplayMarkdown: function (lines: string[]) {
    let content = [];
    lines = lines.map((l) => {
      return l.replaceAll("{", "").replaceAll("}", "");
    });
    for (let i = 0; i < lines.length; i++) {
      let line;
      if (lines[i].startsWith("| ")) {
        //table begins here; find the first line after this table
        let tableEnd = lines.length - 1;
        for (let seek = i; seek < lines.length; seek++) {
          if (!lines[seek].startsWith("| ")) {
            tableEnd = seek - 1;
            break;
          }
        }
        //generate the table
        let tableHeaders: string[] = lines[i].split("|").filter((r) => r != "");
        let tableRows: string[][] = [];
        for (let rowIndex = i + 1; rowIndex < tableEnd; rowIndex++) {
          if (lines[rowIndex].startsWith("| --")) {
            continue;
          } else {
            tableRows.push(lines[rowIndex].split("|").filter((r) => r != ""));
          }
        }
        content.push(
          <table key={i}>
            <thead>
              <tr>
                {tableHeaders.map((h) => (
                  <th key={"header " + h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((r) => (
                <tr key={"row " + r}>
                  {r.map((cell) => (
                    <td key={"cell " + cell}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>,
        );
        //skip to end of table
        i = tableEnd;
      } else {
        if (lines[i].startsWith("- ")) {
          //list begins here; find the first line after this list
          let listEnd = lines.length - 1;
          for (let seek = i; seek < lines.length; seek++) {
            if (!lines[seek].startsWith("- ")) {
              listEnd = seek - 1;
              break;
            }
          }
          //generate list
          let listItems = [];
          for (let listIndex = i; listIndex < listEnd; listIndex++) {
            listItems.push(lines[listIndex].slice(2));
          }
          line = (
            <ul key={i}>
              {listItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
          //skip to end of list
          i = listEnd;
        } else if (lines[i].startsWith("# ")) {
          //heading
          line = <h5>{lines[i].slice(2)}</h5>;
        } else {
          //text body
          line = <p>{lines[i]}</p>;
        }
      }
      content.push(<React.Fragment key={i}>{line}</React.Fragment>);
    }
    return <React.Fragment>{content}</React.Fragment>;
  },
};
