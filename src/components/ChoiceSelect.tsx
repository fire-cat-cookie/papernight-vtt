import React from "react";
import { ReactNode, useState } from "react";

type Props = {
  contentHeight: "Small" | "Medium" | "Large";
  headerContent: ReactNode;
  optionNamesGrouped: { group: string; values: string[] }[];
  optionIsPicked: (option: string) => boolean;
  optionIsValid: (option: string) => boolean;
  detailsContent: (option: string) => ReactNode;
  textAddOption: string;
  textRemoveOption: string;
  onOptionAdd: (option: string) => void;
  onOptionRemove: (option: string) => void;
};

export default function ChoiceSelect(props: Props) {
  const [selectedOption, setSelectedOption] = useState("");

  let contentStyle = { height: "300px" };
  if (props.contentHeight == "Large") {
    contentStyle = { height: "450px" };
  } else if (props.contentHeight == "Small") {
    contentStyle = { height: "150px" };
  }

  function OptionList() {
    return (
      <div className="builder-multiselect-pane-list">
        {props.optionNamesGrouped.map((grouping) => (
          <React.Fragment key={grouping.group}>
            {props.optionNamesGrouped.length > 1 ? (
              <div>
                {<h4>{grouping.group}</h4>}
                {grouping.values.map((value) => ListItem(value))}
              </div>
            ) : (
              <> {grouping.values.map((value) => ListItem(value))}</>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }

  function ListItem(option: string) {
    let contentClassName = "";
    if (selectedOption == option) {
      contentClassName += " active";
    }
    if (props.optionIsPicked(option)) {
      contentClassName += " emphasized";
    }
    return (
      <div key={option} className="builder-multiselect-pane-list-item">
        <div className={contentClassName} onClick={() => setSelectedOption(option)}>
          {option}
        </div>
      </div>
    );
  }

  function OptionDetails() {
    return (
      <div className="builder-multiselect-pane-details" style={contentStyle}>
        <div className="builder-content-col builder-multiselect-pane-details-content">
          {!selectedOption ? (
            <div className="builder-multiselect-pane-details-placeholder">
              <p>Select an option to view its details.</p>
            </div>
          ) : (
            props.detailsContent(selectedOption)
          )}
        </div>
        <div className="builder-content-col builder-multiselect-pane-details-footer">
          {AddRemove()}
        </div>
      </div>
    );
  }

  function AddRemove() {
    if (!selectedOption) {
      return null;
    }
    let addChoiceButton = (
      <button
        disabled={!props.optionIsValid(selectedOption)}
        onClick={() => props.onOptionAdd(selectedOption)}
      >
        {props.textAddOption}
      </button>
    );

    let removeChoiceButton = (
      <button onClick={() => props.onOptionRemove(selectedOption)}>{props.textRemoveOption}</button>
    );
    return props.optionIsPicked(selectedOption) ? removeChoiceButton : addChoiceButton;
  }

  return (
    <React.Fragment>
      <div className="builder-content-col">{props.headerContent}</div>
      <div className="builder-multiselect" style={contentStyle}>
        {OptionList()}
        {OptionDetails()}
      </div>
    </React.Fragment>
  );
}
