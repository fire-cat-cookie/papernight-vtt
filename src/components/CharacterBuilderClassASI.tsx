import { useEffect, useState } from "react";
import { Class } from "../types/Class";
import { Feature } from "../types/Feature";
import { Ability } from "../types/Ability";
import { CharComposed } from "../types/CharComposed";
import { CharDataAction } from "../operations/CharDataReducer";
import { GameUtil } from "../operations/GameUtil";
import { Bonus } from "../types/Bonus";

type Props = {
  feature: Feature;
  selectedClass: Class;
  charComposed: CharComposed;
  updateCharData: React.Dispatch<CharDataAction>;
};

export default function CharacterBuilderClassASI(props: Props) {
  const [modeSelection, setModeSelection] = useState("");
  const [firstAbility, setFirstAbility] = useState<Ability | undefined>(undefined);
  const [secondAbility, setSecondAbility] = useState<Ability | undefined>(undefined);

  useEffect(() => {
    let bonuses = props.feature?.bonuses;
    if (bonuses) {
      if (bonuses.length == 2) {
        setModeSelection("two scores");
        setFirstAbility(GameUtil.AbilityFromTarget(bonuses[0]?.target));
        setSecondAbility(GameUtil.AbilityFromTarget(bonuses[1]?.target));
      } else if (bonuses.length == 1) {
        setModeSelection("one score");
        setFirstAbility(GameUtil.AbilityFromTarget(bonuses[0]?.target));
      }
    }
  }, []);

  function getAllowedAbilities(index: "first" | "second") {
    let abilities = Object.values(Ability);
    if (index == "first") {
      abilities = abilities.filter((a) => a != secondAbility);
    } else if (index == "second") {
      abilities = abilities.filter((a) => a != firstAbility);
    }
    return abilities;
  }

  function updateASIFeature(firstAbility: Ability | undefined, secondAbility: Ability | undefined) {
    let bonuses: Bonus[] = [];
    if (modeSelection == "one score" && firstAbility) {
      bonuses.push({
        target: GameUtil.TargetFromAbilityScore(firstAbility),
        flat: 2,
      });
    } else if (modeSelection == "two scores") {
      if (firstAbility) {
        bonuses.push({
          target: GameUtil.TargetFromAbilityScore(firstAbility),
          flat: 1,
        });
      }
      if (secondAbility) {
        bonuses.push({
          target: GameUtil.TargetFromAbilityScore(secondAbility),
          flat: 1,
        });
      }
    }
    let newFeature = props.feature;
    newFeature.bonuses = bonuses;
    props.updateCharData({
      type: "update-class-feature",
      className: props.selectedClass.name,
      feature: newFeature,
    });
  }

  function renderAbilityScoreSelect(index: "first" | "second") {
    let selectedAbility: any = index == "first" ? firstAbility : secondAbility;
    if (selectedAbility == undefined) {
      selectedAbility = "";
    }
    console.log(selectedAbility);

    let abilityTotal = 0;
    if (index == "first") {
      abilityTotal =
        props.charComposed.abilities.find((a) => a.ability == firstAbility)?.score ?? 0;
    } else if (index == "second") {
      abilityTotal =
        props.charComposed.abilities.find((a) => a.ability == secondAbility)?.score ?? 0;
    }

    return (
      <div className="builder-group builder-row">
        <select
          key={index}
          value={selectedAbility}
          onChange={(e: any) => {
            if (index == "first") {
              updateASIFeature(e.target.value, secondAbility);
              setFirstAbility(e.target.value);
            } else if (index == "second") {
              updateASIFeature(firstAbility, e.target.value);
              setSecondAbility(e.target.value);
            }
          }}
        >
          <option value=""></option>
          {getAllowedAbilities(index).map((a: Ability) => (
            <option key={a}>{a}</option>
          ))}
        </select>
        <label>{abilityTotal ? "Total: " + abilityTotal : ""}</label>
      </div>
    );
  }

  if (props.selectedClass.level < props.feature.level) {
    return null;
  }

  return (
    <div className="builder-group builder-group builder-class-ASI">
      <div className="builder-group builder-row">
        <select
          value={modeSelection}
          onChange={(e: any) => {
            setModeSelection(e.target.value);
            setFirstAbility(undefined);
            setSecondAbility(undefined);
          }}
        >
          <option hidden disabled value="">
            Select an option
          </option>
          <option value="one score">One Ability +2</option>
          <option value="two scores">Two Abilities +1</option>
        </select>
      </div>
      {(modeSelection == "one score" || modeSelection == "two scores") &&
        renderAbilityScoreSelect("first")}
      {modeSelection == "two scores" && renderAbilityScoreSelect("second")}
    </div>
  );
}
