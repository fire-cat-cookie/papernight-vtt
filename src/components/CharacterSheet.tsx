import { useEffect, useState } from "react";
import DiceRoller from "./DiceRoller";
import "./CharacterSheet.scss";
import { CharDataAction } from "../operations/CharDataReducer";
import { EffectTag } from "../types/EffectTag";
import { CharComposed } from "../types/CharComposed";
import { Dice } from "../types/Dice";

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
      .filter((f) => f.senses)
      .map((f) => f.senses)
      .flat(1);
    if (senses) {
      return senses.map((sense: any) => sense.name + " " + sense.range + "ft.").join(", ");
    }
    return "";
  }

  return (
    <div id="sheet">
      {/* 1st row */}
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

      {/* 2nd row */}
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

      {/* 3rd row */}
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

      <div className="sheet-row" id="sheet-con-group-main">
        <div className="sheet-column">
          <div className="sheet-row">
            {/* abilities */}
            <div className="sheet-grouping sheet-column" id="sheet-con-group-abilities">
              <div className="sheet-grouping sheet-con-ability sheet-column" id="sheet-con-str">
                <div className="sheet-row">
                  <label>{"Strength:"}</label>
                  <input disabled value={char.str_score}></input>
                </div>
                <div className="sheet-row">
                  <label className="sheet-de-emphasized">Mod</label>
                  <button
                    className="sheet-button-tiny"
                    onClick={(e) => {
                      openDiceRoller(e, "1d20", char.str_mod);
                    }}
                  >
                    {displayBonus(char.str_mod)}
                  </button>
                </div>
                <div className="sheet-row">
                  <label className="sheet-de-emphasized">Save</label>
                  <button
                    className="sheet-button-tiny"
                    onClick={(e) => {
                      openDiceRoller(e, "1d20", char.str_save);
                    }}
                  >
                    {displayBonus(char.str_save)}
                  </button>
                </div>
              </div>
              <div className="sheet-grouping sheet-con-ability sheet-column" id="sheet-con-dex">
                <div className="sheet-row">
                  <label>{"Dexterity:"}</label>
                  <input disabled value={char.dex_score}></input>
                </div>
                <div className="sheet-row">
                  <label className="sheet-de-emphasized">Mod</label>
                  <button
                    className="sheet-button-tiny"
                    onClick={(e) => {
                      openDiceRoller(e, "1d20", char.dex_mod);
                    }}
                  >
                    {displayBonus(char.dex_mod)}
                  </button>
                </div>
                <div className="sheet-row">
                  <label className="sheet-de-emphasized">Save</label>
                  <button
                    className="sheet-button-tiny"
                    onClick={(e) => {
                      openDiceRoller(e, "1d20", char.dex_save);
                    }}
                  >
                    {displayBonus(char.dex_save)}
                  </button>
                </div>
              </div>
              <div className="sheet-grouping sheet-con-ability sheet-column" id="sheet-con-con">
                <div className="sheet-row">
                  <label>{"Consitution:"}</label>
                  <input disabled value={char.con_score}></input>
                </div>
                <div className="sheet-row">
                  <label className="sheet-de-emphasized">Mod</label>
                  <button
                    className="sheet-button-tiny"
                    onClick={(e) => {
                      openDiceRoller(e, "1d20", char.con_mod);
                    }}
                  >
                    {displayBonus(char.con_mod)}
                  </button>
                </div>
                <div className="sheet-row">
                  <label className="sheet-de-emphasized">Save</label>
                  <button
                    className="sheet-button-tiny"
                    onClick={(e) => {
                      openDiceRoller(e, "1d20", char.con_save);
                    }}
                  >
                    {displayBonus(char.con_save)}
                  </button>
                </div>
              </div>
              <div className="sheet-grouping sheet-con-ability sheet-column" id="sheet-con-int">
                <div className="sheet-row">
                  <label>{"Intelligence:"}</label>
                  <input disabled value={char.int_score}></input>
                </div>
                <div className="sheet-row">
                  <label className="sheet-de-emphasized">Mod</label>
                  <button
                    className="sheet-button-tiny"
                    onClick={(e) => {
                      openDiceRoller(e, "1d20", char.int_mod);
                    }}
                  >
                    {displayBonus(char.int_mod)}
                  </button>
                </div>
                <div className="sheet-row">
                  <label className="sheet-de-emphasized">Save</label>
                  <button
                    className="sheet-button-tiny"
                    onClick={(e) => {
                      openDiceRoller(e, "1d20", char.int_save);
                    }}
                  >
                    {displayBonus(char.int_save)}
                  </button>
                </div>
              </div>
              <div className="sheet-grouping sheet-con-ability sheet-column" id="sheet-con-wis">
                <div className="sheet-row">
                  <label>{"Wisdom:"}</label>
                  <input disabled value={char.wis_score}></input>
                </div>
                <div className="sheet-row">
                  <label className="sheet-de-emphasized">Mod</label>
                  <button
                    className="sheet-button-tiny"
                    onClick={(e) => {
                      openDiceRoller(e, "1d20", char.wis_mod);
                    }}
                  >
                    {displayBonus(char.wis_mod)}
                  </button>
                </div>
                <div className="sheet-row">
                  <label className="sheet-de-emphasized">Save</label>
                  <button
                    className="sheet-button-tiny"
                    onClick={(e) => {
                      openDiceRoller(e, "1d20", char.wis_save);
                    }}
                  >
                    {displayBonus(char.wis_save)}
                  </button>
                </div>
              </div>
              <div className="sheet-grouping sheet-con-ability sheet-column" id="sheet-con-cha">
                <div className="sheet-row">
                  <label>{"Charisma:"}</label>
                  <input disabled value={char.cha_score}></input>
                </div>
                <div className="sheet-row">
                  <label className="sheet-de-emphasized">Mod</label>
                  <button
                    className="sheet-button-tiny"
                    onClick={(e) => {
                      openDiceRoller(e, "1d20", char.cha_mod);
                    }}
                  >
                    {displayBonus(char.cha_mod)}
                  </button>
                </div>
                <div className="sheet-row">
                  <label className="sheet-de-emphasized">Save</label>
                  <button
                    className="sheet-button-tiny"
                    onClick={(e) => {
                      openDiceRoller(e, "1d20", char.cha_save);
                    }}
                  >
                    {displayBonus(char.cha_save)}
                  </button>
                </div>
              </div>
            </div>

            {/* skills */}
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
              <label>Acrobatics</label>
              <button
                className="sheet-button-tiny"
                onClick={(e) => {
                  openDiceRoller(e, "1d20", char.skillMods.acrobatics);
                }}
              >
                {displayBonus(char.skillMods.acrobatics)}
              </button>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={char.skillProf.acrobatics == 1}
              ></input>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={char.skillProf.acrobatics == 2}
              ></input>
              <label>Animal Handling</label>
              <button
                className="sheet-button-tiny"
                onClick={(e) => {
                  openDiceRoller(e, "1d20", char.skillMods.animal_handling);
                }}
              >
                {displayBonus(char.skillMods.animal_handling)}
              </button>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={char.skillProf.animal_handling == 1}
              ></input>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={char.skillProf.animal_handling == 2}
              ></input>
              <label>Arcana</label>
              <button
                className="sheet-button-tiny"
                onClick={(e) => {
                  openDiceRoller(e, "1d20", char.skillMods.arcana);
                }}
              >
                {displayBonus(char.skillMods.arcana)}
              </button>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={char.skillProf.arcana == 1}
              ></input>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={char.skillProf.arcana == 2}
              ></input>
              <label>Athletics</label>
              <button
                className="sheet-button-tiny"
                onClick={(e) => {
                  openDiceRoller(e, "1d20", char.skillMods.athletics);
                }}
              >
                {displayBonus(char.skillMods.athletics)}
              </button>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={char.skillProf.athletics == 1}
              ></input>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={char.skillProf.athletics == 2}
              ></input>
              <label>Deception</label>
              <button
                className="sheet-button-tiny"
                onClick={(e) => {
                  openDiceRoller(e, "1d20", char.skillMods.deception);
                }}
              >
                {displayBonus(char.skillMods.deception)}
              </button>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={char.skillProf.deception == 1}
              ></input>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={char.skillProf.deception == 2}
              ></input>
              <label>History</label>
              <button
                className="sheet-button-tiny"
                onClick={(e) => {
                  openDiceRoller(e, "1d20", char.skillMods.history);
                }}
              >
                {displayBonus(char.skillMods.history)}
              </button>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={char.skillProf.history == 1}
              ></input>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={char.skillProf.history == 2}
              ></input>
              <label>Insight</label>
              <button
                className="sheet-button-tiny"
                onClick={(e) => {
                  openDiceRoller(e, "1d20", char.skillMods.insight);
                }}
              >
                {displayBonus(char.skillMods.insight)}
              </button>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={char.skillProf.insight == 1}
              ></input>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={char.skillProf.insight == 2}
              ></input>
              <label>Intimidation</label>
              <button
                className="sheet-button-tiny"
                onClick={(e) => {
                  openDiceRoller(e, "1d20", char.skillMods.intimidation);
                }}
              >
                {displayBonus(char.skillMods.intimidation)}
              </button>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={char.skillProf.intimidation == 1}
              ></input>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={char.skillProf.intimidation == 2}
              ></input>
              <label>Investigation</label>
              <button
                className="sheet-button-tiny"
                onClick={(e) => {
                  openDiceRoller(e, "1d20", char.skillMods.investigation);
                }}
              >
                {displayBonus(char.skillMods.investigation)}
              </button>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={char.skillProf.investigation == 1}
              ></input>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={char.skillProf.investigation == 2}
              ></input>
              <label>Medicine</label>
              <button
                className="sheet-button-tiny"
                onClick={(e) => {
                  openDiceRoller(e, "1d20", char.skillMods.medicine);
                }}
              >
                {displayBonus(char.skillMods.medicine)}
              </button>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={char.skillProf.medicine == 1}
              ></input>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={char.skillProf.medicine == 2}
              ></input>
              <label>Nature</label>
              <button
                className="sheet-button-tiny"
                onClick={(e) => {
                  openDiceRoller(e, "1d20", char.skillMods.nature);
                }}
              >
                {displayBonus(char.skillMods.nature)}
              </button>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={char.skillProf.nature == 1}
              ></input>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={char.skillProf.nature == 2}
              ></input>
              <label>Perception</label>
              <button
                className="sheet-button-tiny"
                onClick={(e) => {
                  openDiceRoller(e, "1d20", char.skillMods.perception);
                }}
              >
                {displayBonus(char.skillMods.perception)}
              </button>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={char.skillProf.perception == 1}
              ></input>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={char.skillProf.perception == 2}
              ></input>
              <label>Performance</label>
              <button
                className="sheet-button-tiny"
                onClick={(e) => {
                  openDiceRoller(e, "1d20", char.skillMods.performance);
                }}
              >
                {displayBonus(char.skillMods.performance)}
              </button>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={char.skillProf.performance == 1}
              ></input>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={char.skillProf.performance == 2}
              ></input>
              <label>Persuasion</label>
              <button
                className="sheet-button-tiny"
                onClick={(e) => {
                  openDiceRoller(e, "1d20", char.skillMods.persuasion);
                }}
              >
                {displayBonus(char.skillMods.persuasion)}
              </button>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={char.skillProf.persuasion == 1}
              ></input>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={char.skillProf.persuasion == 2}
              ></input>
              <label>Religion</label>
              <button
                className="sheet-button-tiny"
                onClick={(e) => {
                  openDiceRoller(e, "1d20", char.skillMods.religion);
                }}
              >
                {displayBonus(char.skillMods.religion)}
              </button>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={char.skillProf.religion == 1}
              ></input>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={char.skillProf.religion == 2}
              ></input>
              <label>Sleight of Hand</label>
              <button
                className="sheet-button-tiny"
                onClick={(e) => {
                  openDiceRoller(e, "1d20", char.skillMods.sleight_of_hand);
                }}
              >
                {displayBonus(char.skillMods.sleight_of_hand)}
              </button>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={char.skillProf.sleight_of_hand == 1}
              ></input>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={char.skillProf.sleight_of_hand == 2}
              ></input>
              <label>Stealth</label>
              <button
                className="sheet-button-tiny"
                onClick={(e) => {
                  openDiceRoller(e, "1d20", char.skillMods.stealth);
                }}
              >
                {displayBonus(char.skillMods.stealth)}
              </button>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={char.skillProf.stealth == 1}
              ></input>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={char.skillProf.stealth == 2}
              ></input>
              <label>Survival</label>
              <button
                className="sheet-button-tiny"
                onClick={(e) => {
                  openDiceRoller(e, "1d20", char.skillMods.survival);
                }}
              >
                {displayBonus(char.skillMods.survival)}
              </button>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={char.skillProf.survival == 1}
              ></input>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={char.skillProf.survival == 2}
              ></input>
            </div>
          </div>
          <div className="sheet-row">
            {/* misc. proficiencies*/}
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

            {/* inventory*/}
            <div className="sheet-grouping sheet-column" id="sheet-con-group-inventory">
              <label>Inventory</label>
              <br />
              <textarea disabled value={""}></textarea>
            </div>
          </div>
        </div>

        {/* actions & features */}
        <div className="sheet-grouping sheet-column" id="sheet-con-group-traits">
          <div className="sheet-tab-row" id="sheet-tab-row-actions">
            <button
              className={
                selectedActionsTab === "actions" ? "sheet-tab sheet-tab-active" : "sheet-tab"
              }
              onClick={() => setSelectedActionsTab("actions")}
            >
              Actions
            </button>
            <button
              className={
                selectedActionsTab === "bonus actions" ? "sheet-tab sheet-tab-active" : "sheet-tab"
              }
              onClick={() => setSelectedActionsTab("bonus actions")}
            >
              Bonus actions
            </button>
            <button
              className={
                selectedActionsTab === "reactions" ? "sheet-tab sheet-tab-active" : "sheet-tab"
              }
              onClick={() => setSelectedActionsTab("reactions")}
            >
              Reactions
            </button>
            <button
              className={
                selectedActionsTab === "features" ? "sheet-tab sheet-tab-active" : "sheet-tab"
              }
              onClick={() => setSelectedActionsTab("features")}
            >
              Features
            </button>
          </div>
          {selectedActionsTab === "features" ? (
            <div className="sheet-sections">
              {char.features.map((feature) => (
                <div className="sheet-column" key={feature.name}>
                  <label className="label-heading">{feature.name}</label>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          ) : null}
          {selectedActionsTab === "actions" ? (
            <div className="sheet-sections">
              {/*char.spells
                .filter((spell) => spell.casting_time == CastingTime.Action)
                .map((spell) => (
                  <div className="sheet-column" key={spell.name}>
                    <label className="label-heading">{spell.name}</label>
                    <p>{spell.description}</p>
                  </div>
                ))*/}
            </div>
          ) : null}
        </div>
      </div>

      {/* modal overlay */}
      {diceRollerVisible ? (
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
      ) : null}
    </div>
  );
}
