import React, { useState } from "react";
import "./CharacterBuilder.scss";
import "./CharacterBuilderClass.scss";
import { Feature } from "../types/Feature";
import { CharDataAction } from "../operations/CharDataReducer";
import { Class } from "../types/Class";
import * as GetStaticData from "../operations/GetStaticData";
import * as ComposeChar from "../operations/ComposeChar";
import { CharData } from "../types/CharData";
import { GameUtil } from "../operations/GameUtil";
import { Subclass } from "../types/Subclass";
import { CharComposed } from "../types/CharComposed";

type Props = {
  selectedClass: Class;
  subclass?: Subclass;
  feature: Feature;
  charData: CharData;
  charComposed: CharComposed;
  updateCharData: React.Dispatch<CharDataAction>;
  contentHeight: "Small" | "Medium" | "Large";
};

export default function ChoiceSelect(props: Props) {
  let feature = props.feature;
  let options = feature.choices.options;
  let choicesNumber = feature.choices.number ?? 0;
  let contentStyle = {};
  if (props.contentHeight == "Large") {
    contentStyle = { height: "450px" };
  } else if (props.contentHeight == "Medium") {
    contentStyle = { height: "300px" };
  } else {
    contentStyle = { height: "150px" };
  }

  if (feature.choices.optionsSource) {
    options = GetStaticData.getFeatureOptions(feature.choices.optionsSource);
  }

  const [selectedOption, setSelectedOption] = useState("");
  let selectedFeature = options?.find((o) => o.name == selectedOption);
  let optionIsSelected =
    feature.choices?.selected?.find((f) => f.name == selectedOption) != undefined;

  if (feature.choices.variableNumber) {
    choicesNumber = ComposeChar.evaluateFormula(
      props.charData,
      props.selectedClass.name,
      feature.choices.variableNumber,
    );
  }

  let choicesRemaining = choicesNumber - (feature.choices?.selected?.length ?? 0);

  function Header() {
    return (
      <div className="builder-content-col">
        {choicesNumber > 0 && (
          <label>{"Choices available: " + choicesRemaining + "/" + choicesNumber}</label>
        )}
      </div>
    );
  }

  function OptionList() {
    let optionsGrouped: Map<number, Feature[]> = new Map();
    for (let option of options ?? []) {
      let levelRequirement = option.requirements?.find((o) => o.type == "level")?.value ?? 0;
      if (!optionsGrouped.has(levelRequirement)) {
        optionsGrouped.set(levelRequirement, []);
      }
      optionsGrouped.get(levelRequirement)?.push(option);
    }
    return (
      <div className="builder-multiselect-pane-list">
        {Array.from(optionsGrouped.keys())
          .sort((a, b) => a - b)
          .map((grouping) => (
            <React.Fragment key={grouping}>
              {optionsGrouped.size > 1 ? (
                <div>
                  {grouping != 0 && <h4>Level {grouping}</h4>}
                  {optionsGrouped.get(grouping)?.map((option) => ListItem(option))}
                </div>
              ) : (
                <>{optionsGrouped.get(grouping)?.map((option) => ListItem(option))}</>
              )}
            </React.Fragment>
          ))}
      </div>
    );
  }

  function ListItem(option: Feature) {
    let className = "";
    if (selectedOption == option.name) {
      className += " active";
    }
    if (feature.choices?.selected?.find((c) => c.name == option.name) != undefined) {
      className += " emphasized";
    }
    return (
      <div key={option.name} className="builder-multiselect-pane-list-item">
        <div className={className} onClick={() => setSelectedOption(option.name)}>
          {option.name}
        </div>
      </div>
    );
  }

  function OptionDetails() {
    return (
      <div className="builder-multiselect-pane-details" style={contentStyle}>
        <div className="builder-content-col builder-multiselect-pane-details-content">
          {selectedFeature && <h3>{selectedFeature.name}</h3>}
          {!selectedFeature ? (
            <div className="builder-multiselect-pane-details-placeholder">
              <p>Select an option to view its details.</p>
            </div>
          ) : (
            <div className="builder-content-col">
              {OptionHeader()}
              {GameUtil.DisplayMarkdown(selectedFeature?.description ?? [])}
            </div>
          )}
        </div>
        <div className="builder-content-col builder-multiselect-pane-details-footer">
          {AddRemove()}
        </div>
      </div>
    );
  }

  function OptionHeader() {
    if (!selectedFeature?.requirements) {
      return null;
    }
    return (
      <div className="builder-multiselect-pane-details-header">
        <div className="builder-content-col">
          <label>Requirements</label>
          {selectedFeature.requirements.map((r) => (
            <span key={r.type + r.value}>{GameUtil.DisplayRequirement(r)}</span>
          ))}
        </div>
      </div>
    );
  }

  function AddRemove() {
    if (!selectedOption || !options || !selectedFeature) {
      return null;
    }
    let optionIsValid = IsOptionValid(optionIsSelected);
    let addChoiceButton = (
      <button
        disabled={!optionIsValid}
        onClick={() =>
          props.updateCharData({
            type: props.subclass ? "update-subclass-feature" : "update-class-feature",
            feature: {
              ...feature,
              choices: {
                ...feature.choices,
                selected: [...(feature.choices?.selected ?? []), selectedFeature],
              },
            },
            className: props.selectedClass.name,
          })
        }
      >
        Choose Option
      </button>
    );
    let removeChoiceButton = (
      <button
        onClick={() =>
          props.updateCharData({
            type: props.subclass ? "update-subclass-feature" : "update-class-feature",
            feature: {
              ...feature,
              choices: {
                ...feature.choices,
                selected: feature.choices?.selected?.filter((c) => c.name != selectedOption) ?? [],
              },
            },
            className: props.selectedClass.name,
          })
        }
      >
        Remove Option
      </button>
    );

    return optionIsSelected ? removeChoiceButton : addChoiceButton;
  }

  function IsOptionValid(optionIsChosen: boolean) {
    let valid = true;
    if (optionIsChosen || choicesRemaining < 1) {
      return false;
    }
    if (selectedFeature?.requirements) {
      if (!GameUtil.CheckRequirements(props.charComposed, selectedFeature)) {
        valid = false;
      }
    }
    return valid;
  }

  return (
    <React.Fragment>
      {Header()}
      <div className="builder-multiselect" style={contentStyle}>
        {OptionList()}
        {OptionDetails()}
      </div>
    </React.Fragment>
  );
}
