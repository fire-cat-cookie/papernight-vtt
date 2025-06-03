import { useState } from "react";
import DiceRoller from "./DiceRoller";
import "./CharacterSheet.scss";
import { CharDataAction } from "../operations/CharDataReducer";
import { EffectTag } from "../types/EffectTag";
import { CharComposed } from "../types/CharComposed";
import { Dice } from "../types/Dice";
import { Ability } from "../types/Ability";
import React from "react";
import { Skill } from "../types/Skill";
import { Feature } from "../types/Feature";

type Props = {
  char: CharComposed;
  updateCharData: React.Dispatch<CharDataAction>;
};

export default function CharacterSheet(props: Props) {
  let char = props.char;

  const [diceRollerVisible, setDiceRollerVisible] = useState(false);
  const [nextRoll, setNextRoll] = useState({ dice: "1d20", bonus: 0 });
  const [diceRollerPosition, setDiceRollerPosition] = useState({ x: 0, y: 0 });
  const [selectedActionsTab, setSelectedActionsTab] = useState("actions");

  function closeModalDialogs() {
    setDiceRollerVisible(false);
  }

  function openDiceRoller(event: any, dice: string, bonus: number) {
    setDiceRollerVisible(true);
    setDiceRollerPosition({
      x: event.target.offsetLeft + event.target.offsetWidth + 5,
      y: event.target.offsetTop,
    });
    setNextRoll({ dice: dice, bonus: bonus });
  }

  function displayBonus(bonus: number): string {
    return bonus >= 0 ? "+" + bonus : "" + bonus;
  }

  function displayHitDice(dice: Dice[]) {
    let result = "";
    let diceGrouped: Map<number, number> = new Map();

    for (let die of dice) {
      diceGrouped.set(die.sides, (diceGrouped.get(die.sides) ?? 0) + die.amount);
    }

    for (let die of diceGrouped.entries()) {
      result += die[1] + "d" + die[0] + "  ";
    }
    return result;
  }

  function displayClassLevel() {
    let output = "";
    let classLevelsSorted = char.classLevel.slice().sort((a, b) => a.level - b.level);
    for (let c of classLevelsSorted) {
      output += c.class + " " + c.level;
      if (c.subclass) {
        output += " (" + c.subclass + ")";
      }
      output += " ";
    }
    return output;
  }

  function displaySenses() {
    let senses = char.features
      .filter((f) => f.feature.senses)
      .map((f) => f.feature.senses)
      .flat(1);
    if (senses) {
      return senses.map((sense: any) => sense.name + " " + sense.range + "ft.").join(", ");
    }
    return "";
  }

  function renderFirstRow() {
    return (
      <div className="sheet-grouping sheet-row">
        <div id="sheet-con-charname">
          <label id="sheet-data-charname">{char.name}</label>
        </div>
        <div id="sheet-con-classlevel">
          <label id="sheet-data-classlevel">{displayClassLevel()}</label>
          <br />
        </div>
        <div id="sheet-con-lineage">
          <label id="sheet-data-lineage">{char.sublineage ? char.sublineage : char.lineage}</label>
          <br />
        </div>
      </div>
    );
  }

  function renderSecondRow() {
    return (
      <div className="sheet-grouping sheet-row">
        <div className="sheet-grouping sheet-row" id="sheet-con-group-initiative">
          <div id="sheet-con-initiative">
            <label>Initiative</label>
            <br />
            <button
              className="sheet-button-tiny"
              id="sheet-data-initiative"
              onClick={(event) => {
                openDiceRoller(event, "1d20", char.initiative);
              }}
            >
              {displayBonus(char.initiative)}
            </button>
          </div>
          <div id="sheet-con-ac">
            <label>AC</label>
            <br />
            <label id="sheet-data-ac">{char.ac}</label>
          </div>
          <div id="sheet-con-inspiration">
            <label>Inspiration</label>
            <br />
            <input
              disabled
              type="checkbox"
              id="sheet-data-inspiration"
              checked={char.status.inspiration}
              onChange={() => {}}
            ></input>
          </div>
        </div>
        <div className="sheet-grouping sheet-row" id="sheet-con-group-hp">
          <label className="label-heading">Hit Points</label>
          <div className="sheet-field-annotated">
            <label className="sheet-de-emphasized">Current</label>
            <label id="sheet-data-hp-current">{char.hp_current}</label>
          </div>
          <div className="sheet-field-annotated">
            <label className="sheet-de-emphasized">Maximum</label>
            <label id="sheet-data-hp-max">{char.hp_max}</label>
          </div>
          <div className="sheet-field-annotated">
            <label className="sheet-de-emphasized">Temporary</label>
            <label id="sheet-data-hp-temp">{char.status.hp_temp}</label>
          </div>
        </div>
        <div className="sheet-grouping sheet-row" id="sheet-con-group-hitdice">
          <label className="label-heading">Hit Dice</label>
          <div className="sheet-field-annotated">
            <label className="sheet-de-emphasized">Remaining</label>
            <label id="sheet-data-hitdice-remaining">
              {displayHitDice(char.status.hit_dice_remaining)}
            </label>
          </div>
          <span className="gap-vertical" />
          <div className="sheet-field-annotated">
            <label className="sheet-de-emphasized">Total</label>
            <label id="sheet-data-hitdice-total">{displayHitDice(char.hit_dice_total)}</label>
          </div>
        </div>
        <div className="sheet-grouping sheet-row" id="sheet-con-group-conditions">
          <div id="sheet-con-conditions">
            <label>Conditions</label>
            <br />
            <textarea disabled id="sheet-data-conditions" value={""}></textarea>
          </div>
        </div>
      </div>
    );
  }

  function renderThirdRow() {
    return (
      <div className="sheet-grouping sheet-row">
        <div className="sheet-row" id="sheet-con-group-anatomy">
          <div id="sheet-con-speed">
            <label>Speed</label>
            <br />
            <label id="sheet-data-speed">{char.speed + " ft."}</label>
          </div>
          <div id="sheet-con-creaturetype">
            <label>Creature Type</label>
            <br />
            <label id="sheet-data-creaturetype">{char.creatureType}</label>
          </div>
          <div id="sheet-con-size">
            <label>Size</label>
            <br />
            <label id="sheet-data-size">{char.size}</label>
          </div>
          <div id="sheet-con-senses">
            <label>Senses</label>
            <br />
            <label id="sheet-data-senses">{displaySenses()}</label>
          </div>
        </div>
      </div>
    );
  }

  function renderAbility(ability: Ability) {
    let charAbility = char.abilities.find((a) => a.ability == ability);

    return (
      <div className="sheet-grouping sheet-con-ability sheet-column">
        <div className="sheet-row">
          <label>{ability.toString() + ":"}</label>
          <input disabled value={charAbility?.score}></input>
        </div>
        <div className="sheet-row">
          <label className="sheet-de-emphasized">Mod</label>
          <button
            className="sheet-button-tiny"
            onClick={(e) => {
              openDiceRoller(e, "1d20", charAbility?.mod ?? 0);
            }}
          >
            {displayBonus(charAbility?.mod ?? 0)}
          </button>
        </div>
        <div className="sheet-row">
          <label className="sheet-de-emphasized">Save</label>
          <button
            className="sheet-button-tiny"
            onClick={(e) => {
              openDiceRoller(e, "1d20", charAbility?.save ?? 0);
            }}
          >
            {displayBonus(charAbility?.save ?? 0)}
          </button>
        </div>
      </div>
    );
  }

  function renderAbilities() {
    return (
      <div className="sheet-grouping sheet-column" id="sheet-con-group-abilities">
        {renderAbility(Ability.str)}
        {renderAbility(Ability.dex)}
        {renderAbility(Ability.con)}
        {renderAbility(Ability.int)}
        {renderAbility(Ability.wis)}
        {renderAbility(Ability.cha)}
      </div>
    );
  }

  function renderSkill(skill: Skill) {
    let charSkill = char.skills.find((s) => s.skill == skill);

    return (
      <React.Fragment key={skill.toString()}>
        <label>{skill.toString()}</label>
        <button
          className="sheet-button-tiny"
          onClick={(e) => {
            openDiceRoller(e, "1d20", charSkill?.mod ?? 0);
          }}
        >
          {displayBonus(charSkill?.mod ?? 0)}
        </button>
        <input
          disabled
          className="sheet-skill-prof"
          type="checkbox"
          checked={charSkill?.prof == 1}
        ></input>
        <input
          disabled
          className="sheet-skill-prof"
          type="checkbox"
          checked={charSkill?.prof == 2}
        ></input>
      </React.Fragment>
    );
  }

  function renderSkills() {
    return (
      <div className="sheet-grouping" id="sheet-con-group-skills">
        <label>Proficiency Bonus:</label>
        <input
          disabled
          id="sheet-label-proficiency-bonus"
          value={displayBonus(char.proficiency_bonus)}
        ></input>
        <div></div>
        <div></div>
        <div></div>
        <label className="sheet-de-emphasized">Mod.</label>
        <label className="sheet-de-emphasized">Prof.</label>
        <label className="sheet-de-emphasized">Exp.</label>
        {char.skills.map((s) => renderSkill(s.skill))}
      </div>
    );
  }

  function renderMiscProficiencies() {
    return (
      <div className="sheet-grouping sheet-row" id="sheet-con-group-proficiencies">
        <div>
          <label className="label-heading">Languages</label>
          <br />
          <textarea
            disabled
            value={
              "" /*Util.ListDistinct(
                    char.languages.map((lang) => lang.language),
                    ", "
                  )*/
            }
          ></textarea>
        </div>
        <div>
          <label className="label-heading">Tool Proficiencies</label>
          <br />
          <textarea disabled value={""}></textarea>
        </div>
        <div>
          <label className="label-heading">Armor & Weapon Proficiencies</label>
          <br />
          <textarea disabled value={""}></textarea>
        </div>
      </div>
    );
  }

  function renderInventory() {
    return (
      <div className="sheet-grouping sheet-column" id="sheet-con-group-inventory">
        <label>Inventory</label>
        <br />
        <textarea disabled value={""}></textarea>
      </div>
    );
  }

  function renderFeatureTab(tabName: string, label: string) {
    return (
      <button
        className={selectedActionsTab === tabName ? "sheet-tab sheet-tab-active" : "sheet-tab"}
        onClick={() => setSelectedActionsTab(tabName)}
      >
        {label}
      </button>
    );
  }

  function renderFeatureTabContent(tabName: string, actionType: string | undefined) {
    let hiddenFeatures = ["Languages", "Ability Scores", "Darkvision"];

    return (
      selectedActionsTab === tabName && (
        <div className="sheet-sections sheet-feature-list">
          {char.features
            .filter(
              (f) =>
                f.feature.actionType == actionType &&
                !f.feature.abilityScoreImprovement &&
                !f.feature.subclassFeature &&
                hiddenFeatures.indexOf(f.feature.name) == -1
            )
            .map((f) => (
              <div
                className="sheet-column"
                key={f.source + " " + f.feature.level + " " + f.feature.name}
              >
                <label className="label-heading">{f.feature.name}</label>
                <p>{f.feature.description}</p>
              </div>
            ))}
        </div>
      )
    );
  }

  function renderActionsAndFeatures() {
    return (
      <div className="sheet-grouping sheet-column" id="sheet-con-group-traits">
        <div className="sheet-tab-row" id="sheet-tab-row-actions">
          {renderFeatureTab("actions", "Actions")}
          {renderFeatureTab("bonus actions", "Bonus Actions")}
          {renderFeatureTab("reactions", "Reactions")}
          {renderFeatureTab("other", "Other")}
        </div>
        {renderFeatureTabContent("actions", "action")}
        {renderFeatureTabContent("bonus actions", "bonus action")}
        {renderFeatureTabContent("reactions", "reaction")}
        {renderFeatureTabContent("other", undefined)}
      </div>
    );
  }

  function renderModalOverlay() {
    return (
      diceRollerVisible && (
        <div className="sheet-modal-overlay" onClick={closeModalDialogs}>
          <div className="sheet-modal-overlay-inner" onClick={(e) => e.stopPropagation()}>
            {/* dice roller dialog */}
            {diceRollerVisible ? (
              <>
                <div id="dice-roller-offset-left" style={{ width: diceRollerPosition.x }}></div>
                <div id="dice-roller-container" style={{ top: diceRollerPosition.y }}>
                  <DiceRoller
                    initialDice={nextRoll.dice}
                    initialBonus={displayBonus(nextRoll.bonus)}
                    char={char}
                    conditionalEffectsFilter={[EffectTag.SavingThrows]}
                  ></DiceRoller>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )
    );
  }

  return (
    <div id="sheet">
      {renderFirstRow()}
      {renderSecondRow()}
      {renderThirdRow()}
      <div className="sheet-row" id="sheet-con-group-main">
        <div className="sheet-column">
          <div className="sheet-row">
            {renderAbilities()}
            {renderSkills()}
          </div>
          <div className="sheet-row">
            {renderMiscProficiencies()}
            {renderInventory()}
          </div>
        </div>
        {renderActionsAndFeatures()}
      </div>
      {renderModalOverlay()}
    </div>
  );
}
