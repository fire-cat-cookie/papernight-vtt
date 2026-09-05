import { Class } from "../types/Class";
import * as ComposeChar from "../operations/ComposeChar";
import { Feature } from "../types/Feature";
import * as GetStaticData from "../operations/GetStaticData";
import { CharData } from "../types/CharData";
import { GameUtil } from "../operations/GameUtil";
import { CharComposed } from "../types/CharComposed";
import { CharDataAction } from "../operations/CharDataReducer";
import ChoiceSelectGeneric from "./ChoiceSelect";

type Props = {
  feature: Feature;
  subclassFeature?: boolean;
  selectedClass: Class;
  charData: CharData;
  charComposed: CharComposed;
  updateCharData: React.Dispatch<CharDataAction>;
};

export default function ChoiceSelect_FeatureOptions(props: Props) {
  let feature = props.feature;
  let selectedClass = props.selectedClass;

  let contentHeight: "Medium" | "Large" = "Medium";
  let options = feature.choices?.options ?? [];
  if (feature.choices?.optionsSource) {
    options = GetStaticData.getFeatureOptions(feature.choices.optionsSource);
  }
  if (options.length > 9) {
    contentHeight = "Large";
  }

  let choicesNumber = feature.choices.number ?? 0;
  if (feature.choices.variableNumber) {
    choicesNumber = ComposeChar.evaluateFormula(
      props.charData,
      selectedClass.name,
      feature.choices.variableNumber,
    );
  }

  let choicesRemaining = choicesNumber - (feature.choices?.selected?.length ?? 0);

  function OptionsGrouped() {
    let optionsGrouped: Map<number, string[]> = new Map();
    for (let option of options ?? []) {
      let levelRequirement = option.requirements?.find((o) => o.type == "level")?.value ?? 0;
      if (!optionsGrouped.has(levelRequirement)) {
        optionsGrouped.set(levelRequirement, []);
      }
      optionsGrouped.get(levelRequirement)?.push(option.name);
    }
    let optionsGroupedArray: { group: string; values: string[] }[] = [];
    let keys = Array.from(optionsGrouped.keys()).sort((a, b) => a - b);
    for (let key of keys) {
      let groupName = key == 0 ? "Level 1" : "Level " + key;
      optionsGroupedArray.push({ group: groupName, values: optionsGrouped.get(key) ?? [] });
    }
    return optionsGroupedArray;
  }

  function FindFeature(option: string) {
    return options.find((f) => f.name == option);
  }

  function IsOptionPicked(option: string) {
    return feature.choices?.selected?.find((f) => f.name == option) != undefined;
  }

  function IsOptionValid(option: string) {
    let valid = true;
    if (IsOptionPicked(option) || choicesRemaining < 1) {
      return false;
    }
    let selectedFeature = FindFeature(option);
    if (selectedFeature?.requirements) {
      if (!GameUtil.CheckRequirements(props.charComposed, selectedFeature)) {
        valid = false;
      }
    }
    return valid;
  }

  function HeaderContent() {
    return (
      <>
        {choicesNumber > 0 && (
          <label>{"Choices available: " + choicesRemaining + "/" + choicesNumber}</label>
        )}
      </>
    );
  }

  function DetailsContent(option: string) {
    let selectedFeature = FindFeature(option);
    if (!selectedFeature) {
      return null;
    }
    let featureHeader = !selectedFeature.requirements ? null : (
      <div className="builder-multiselect-pane-details-header">
        <div className="builder-content-col">
          <label>Requirements</label>
          {selectedFeature.requirements.map((r) => (
            <span key={r.type + r.value}>{GameUtil.DisplayRequirement(r)}</span>
          ))}
        </div>
      </div>
    );
    return (
      <>
        <div className="builder-content-col">
          <h3>{selectedFeature.name}</h3>
        </div>
        <div className="builder-content-col">
          {featureHeader}
          {GameUtil.DisplayMarkdown(selectedFeature?.description ?? [])}
        </div>
      </>
    );
  }

  function OnOptionAdd(option: string) {
    let selectedFeature = FindFeature(option);
    if (!selectedFeature) {
      return;
    }
    props.updateCharData({
      type: props.subclassFeature ? "update-subclass-feature" : "update-class-feature",
      feature: {
        ...feature,
        choices: {
          ...feature.choices,
          selected: [...(feature.choices?.selected ?? []), selectedFeature],
        },
      },
      className: selectedClass.name,
    });
  }

  function OnOptionRemove(option: string) {
    props.updateCharData({
      type: props.subclassFeature ? "update-subclass-feature" : "update-class-feature",
      feature: {
        ...feature,
        choices: {
          ...feature.choices,
          selected: feature.choices?.selected?.filter((c) => c.name != option) ?? [],
        },
      },
      className: selectedClass.name,
    });
  }

  return (
    <ChoiceSelectGeneric
      contentHeight={contentHeight}
      headerContent={HeaderContent()}
      optionNamesGrouped={OptionsGrouped()}
      optionIsPicked={IsOptionPicked}
      optionIsValid={IsOptionValid}
      detailsContent={DetailsContent}
      textAddOption={"Choose Option"}
      textRemoveOption={"Remove Option"}
      onOptionAdd={OnOptionAdd}
      onOptionRemove={OnOptionRemove}
    ></ChoiceSelectGeneric>
  );
}
