import React, { useEffect, useState } from "react";
import { Class } from "../types/Class";
import { Feature } from "../types/Feature";
import { Spell } from "../types/Spell";
import { GameUtil } from "../operations/GameUtil";
import { getClassSpells } from "../operations/GetStaticData";
import { CharDataAction } from "../operations/CharDataReducer";
import "./CharacterBuilder.scss";
import "./CharacterBuilderClass.scss";

type Props = {
  selectedClass: Class;
  spellcastingFeature: Feature;
  updateCharData: React.Dispatch<CharDataAction>;
};

export default function SpellSelect(props: Props) {
  const [selectedSpellName, setSelectedSpellName] = useState("");

  let selectedClass = props.selectedClass;
  let spellcastingFeature = props.spellcastingFeature;
  let spellOptions: any[] = getClassSpells(selectedClass?.name ?? "");
  let selectedSpell: any = spellOptions?.find((s) => s.name == selectedSpellName);

  useEffect(() => {
    if (selectedSpellName && !selectedSpell) {
      setSelectedSpellName("");
    }
  }, [selectedSpellName, selectedSpell]);

  function SpellSelectHeader() {
    let totalSpells = selectedClass.spellsKnown[selectedClass.level - 1];
    let totalCantrips = selectedClass.cantripsKnown[selectedClass.level - 1];
    let availableSpells =
      totalSpells - (spellcastingFeature?.spellcasting?.filter((s) => s.level > 0)?.length ?? 0);
    let availableCantrips =
      totalCantrips - (spellcastingFeature?.spellcasting?.filter((s) => s.level == 0)?.length ?? 0);

    return (
      <div className="builder-content-col">
        {totalCantrips > 0 && (
          <label>{"Cantrips available: " + availableCantrips + "/" + totalCantrips}</label>
        )}
        {totalSpells > 0 && (
          <label>{"Spells available: " + availableSpells + "/" + totalSpells}</label>
        )}
      </div>
    );
  }

  function SpellSelectList() {
    let spellsByLevel: Map<number, Spell[]> = new Map();
    for (let spell of spellOptions) {
      if (!spellsByLevel.has(spell.level)) {
        spellsByLevel.set(spell.level, []);
      }
      spellsByLevel.get(spell.level)?.push(spell);
    }
    let levelsAsText = [
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
    return (
      <div className="builder-multiselect-pane-list">
        {levelsAsText.map((spellLevel, index) => {
          return spellsByLevel.has(index) ? (
            <div key={index}>
              <h4>{spellLevel}</h4>
              {spellsByLevel.get(index)?.map((spell) => SpellSelectListItem(spell))}
            </div>
          ) : null;
        })}
      </div>
    );
  }

  function SpellSelectListItem(spell: Spell) {
    return (
      <React.Fragment key={spell.name}>
        <div className="builder-multiselect-pane-list-item">
          <div
            className={selectedSpellName == spell.name ? "active" : ""}
            onClick={() => setSelectedSpellName(spell.name)}
          >
            {spell.name}
          </div>
        </div>
      </React.Fragment>
    );
  }

  function SpellSelectDetails() {
    return (
      <div className="builder-multiselect-pane-details">
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
          {LearnOrRemoveSpell()}
        </div>
      </div>
    );
  }

  function LearnOrRemoveSpell() {
    if (!selectedSpell) {
      return null;
    }
    let findSpell = spellcastingFeature.spellcasting
      ?.map((s) => s.name)
      ?.indexOf(selectedSpell.name);
    let spellIsLearnt = findSpell != -1 && findSpell != undefined;
    let canLearnSpell = CanLearnSpell(spellIsLearnt);
    let learnSpellButton = (
      <button
        disabled={!canLearnSpell}
        onClick={() =>
          props.updateCharData({
            type: "add-spell",
            spellName: selectedSpell.name,
            className: selectedClass.name,
            featureName: spellcastingFeature.name,
          })
        }
      >
        Learn Spell
      </button>
    );
    let removeSpellButton = (
      <button
        onClick={() =>
          props.updateCharData({
            type: "remove-spell",
            spellName: selectedSpell.name,
            className: selectedClass.name,
            featureName: spellcastingFeature.name,
          })
        }
      >
        Remove Spell
      </button>
    );

    return spellIsLearnt ? removeSpellButton : learnSpellButton;
  }

  function CanLearnSpell(spellIsLearnt: boolean) {
    if (!selectedSpell) {
      return false;
    }
    if (spellIsLearnt) {
      return false;
    }
    let requiredSpellLevel = true;
    let choicesRemaining = true;
    if (spellcastingFeature.name == "Pact Magic") {
      let spellSlotProgression = selectedClass.progression
        ?.find((p) => p.name == "Slot Level")
        ?.entries?.map((e) => e.value);
      let highestSpellSlot: number = spellSlotProgression?.[selectedClass.level - 1] ?? 0;
      let cantripsKnown: number = selectedClass.cantripsKnown?.[selectedClass.level - 1] ?? 0;
      let spellsKnown: number = selectedClass.spellsKnown?.[selectedClass.level - 1] ?? 0;
      let cantripsLearnt: number =
        spellcastingFeature.spellcasting?.filter((s) => s.level == 0)?.length ?? 0;
      let spellsLearnt: number =
        spellcastingFeature.spellcasting?.filter((s) => s.level > 0)?.length ?? 0;
      if (selectedSpell.level > highestSpellSlot) {
        requiredSpellLevel = false;
      }
      if (selectedSpell.level == 0 && cantripsKnown - cantripsLearnt < 1) {
        requiredSpellLevel = false;
      }
      if (selectedSpell.level > 0 && spellsKnown - spellsLearnt < 1) {
        choicesRemaining = false;
      }
    }
    return requiredSpellLevel == true && choicesRemaining == true;
  }

  function SpellInfoHeader() {
    let s: Spell = selectedSpell;
    let spellLevel = "";
    switch (s.level) {
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

  return (
    <React.Fragment>
      {SpellSelectHeader()}
      <div className="builder-multiselect">
        {SpellSelectList()}
        {SpellSelectDetails()}
      </div>
    </React.Fragment>
  );
}
