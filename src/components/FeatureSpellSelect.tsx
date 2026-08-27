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
import { Spell } from "../types/Spell";

type Props = {
  selectedClass: Class;
  subclass?: Subclass;
  feature: Feature;
  charData: CharData;
  charComposed: CharComposed;
  updateCharData: React.Dispatch<CharDataAction>;
};

export default function FeatureSpellSelect(props: Props) {
  const levelsAsText = [
    "Cantrips",
    "1st Level",
    "2nd Level",
    "3rd Level",
    "4th Level",
    "5th Level",
    "6th Level",
    "7th Level",
    "8th Level",
    "9th Level",
  ];
  let contentStyle = { height: "450px" };
  let feature = props.feature;
  let spellList = feature.gainSpells?.spellList;
  let spellNames = spellList?.spellNames ?? [];
  let options = GetStaticData.getSpellList(spellNames);
  if (spellList?.source) {
    options = GetStaticData.getClassSpells(props.selectedClass.name);
    if (spellList.spellLevel != undefined) {
      options = options.filter((s) => s.level == spellList.spellLevel);
    }
    if (spellList.spellSchool != undefined) {
      options = options.filter((s) => s.school == spellList.spellSchool);
    }
    spellNames = options?.map((s) => s.name) ?? [];
  }
  let choicesNumber = feature.gainSpells?.number ?? 0;
  if (feature.gainSpells?.variableNumber) {
    choicesNumber = ComposeChar.evaluateFormula(
      props.charData,
      props.selectedClass.name,
      feature.gainSpells?.variableNumber,
    );
  }

  const [selectedSpellName, setSelectedSpellName] = useState("");
  let selectedSpell = options.find((s) => s.name == selectedSpellName);
  let spellIsLearnt =
    (feature.gainSpells?.selected?.map((s) => s.name) ?? []).find(
      (name) => name == selectedSpellName,
    ) != undefined;

  let choicesRemaining = choicesNumber - (feature.gainSpells?.selected?.length ?? 0);

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
    let spellsByLevel: Map<number, Spell[]> = new Map();
    for (let option of options ?? []) {
      let spellLevel = option.level;
      if (!spellsByLevel.has(spellLevel)) {
        spellsByLevel.set(spellLevel, []);
      }
      spellsByLevel.get(spellLevel)?.push(option);
    }
    return (
      <div className="builder-multiselect-pane-list">
        {levelsAsText.map((spellLevel, index) => {
          return spellsByLevel.has(index) ? (
            <div key={index}>
              <h4>{spellLevel}</h4>
              {spellsByLevel.get(index)?.map((spell) => ListItem(spell))}
            </div>
          ) : null;
        })}
      </div>
    );
  }

  function ListItem(spell: Spell) {
    let className = "";
    if (selectedSpellName == spell.name) {
      className += " active";
    }
    if (feature.gainSpells?.selected?.find((s) => s.name == spell.name) != undefined) {
      className += " emphasized";
    }
    return (
      <React.Fragment key={spell.name}>
        <div className="builder-multiselect-pane-list-item">
          <div className={className} onClick={() => setSelectedSpellName(spell.name)}>
            {spell.name}
          </div>
        </div>
      </React.Fragment>
    );
  }

  function OptionDetails() {
    return (
      <div className="builder-multiselect-pane-details" style={contentStyle}>
        <div className="builder-content-col builder-multiselect-pane-details-content">
          {selectedSpell && <h3>{selectedSpell.name}</h3>}
          {!selectedSpell ? (
            <div className="builder-spell-details-placeholder">
              <p>Select a spell to view its details.</p>
            </div>
          ) : (
            <div className="builder-content-col">
              {SpellInfoHeader()}
              {GameUtil.DisplayMarkdown(selectedSpell?.description ?? [])}
            </div>
          )}
        </div>
        <div className="builder-content-col builder-multiselect-pane-details-footer">
          {AddRemove()}
        </div>
      </div>
    );
  }

  function SpellInfoHeader() {
    if (!selectedSpell) {
      return null;
    }
    let s: Spell = selectedSpell;
    let spellLevel = "";
    switch (selectedSpell.level) {
      case 0:
        spellLevel = "Cantrip";
        break;
      case 1:
        spellLevel = "1st";
        break;
      case 2:
        spellLevel = "2nd";
        break;
      case 3:
        spellLevel = "3rd";
        break;
    }
    if (s.level >= 4 && s.level <= 9) {
      spellLevel = s.level + "th";
    }

    return (
      <div className="builder-multiselect-pane-details-header">
        <div className="builder-table" style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr" }}>
          <div className="builder-content-col">
            <label>Spell Level</label>
            <span>{spellLevel}</span>
          </div>
          <div className="builder-content-col">
            <label>School</label>
            <span>{s.school}</span>
          </div>
          <div className="builder-content-col">
            <label>Ritual</label>
            <span>{s.ritual ? "Yes" : "No"}</span>
          </div>
          <div className="builder-content-col">
            <label>Range</label>
            <span>{s.range}</span>
          </div>
          <div className="builder-content-col">
            <label>Duration</label>
            <span>{GameUtil.Capitalize(s.duration)}</span>
          </div>
        </div>
        <div className="builder-table" style={{ gridTemplateColumns: "3fr 2fr" }}>
          <div className="builder-content-col">
            <label>Components</label>
            <span>{s.components}</span>
          </div>
          <div className="builder-content-col">
            <label>Casting Time</label>
            <span>{s.castingTime}</span>
          </div>
        </div>
      </div>
    );
  }

  function AddRemove() {
    if (!selectedSpellName || !options || !selectedSpell) {
      return null;
    }
    let optionIsValid = IsOptionValid(spellIsLearnt);
    let addChoiceButton = (
      <button
        disabled={!optionIsValid}
        onClick={() =>
          props.updateCharData({
            type: props.subclass ? "update-subclass-feature" : "update-class-feature",
            feature: {
              ...feature,
              gainSpells: {
                ...feature.gainSpells,
                selected: [...(feature.gainSpells?.selected ?? []), { name: selectedSpellName }],
              },
            },
            className: props.selectedClass.name,
          })
        }
      >
        Learn Spell
      </button>
    );
    let removeChoiceButton = (
      <button
        onClick={() =>
          props.updateCharData({
            type: props.subclass ? "update-subclass-feature" : "update-class-feature",
            feature: {
              ...feature,
              gainSpells: {
                ...feature.gainSpells,
                selected:
                  feature.gainSpells?.selected?.filter((s) => s.name != selectedSpellName) ?? [],
              },
            },
            className: props.selectedClass.name,
          })
        }
      >
        Remove Spell
      </button>
    );

    return spellIsLearnt ? removeChoiceButton : addChoiceButton;
  }

  function IsOptionValid(optionIsChosen: boolean) {
    let valid = true;
    if (optionIsChosen || choicesRemaining < 1) {
      return false;
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
