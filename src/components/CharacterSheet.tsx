import { useState } from "react";
import DiceRoller from "./DiceRoller";
import "./CharacterSheet.scss";
import { CreatureSize } from "../types/CreatureSize";
import { Bonus } from "../types/Bonus";
import { HitDice } from "../types/HitDice";
import { AbilityData } from "../types/AbilityData";
import SkillData from "../types/SkillData";
import { Ability } from "../types/Ability";
import { CharData } from "../types/CharData";
import { CharDataAction } from "../operations/CharDataReducer";
import { Util } from "../operations/Util";
import { EffectTag } from "../types/EffectTag";
import { CastingTime } from "../types/CastingTime";

type Props = {
  charData: CharData;
  updateCharData: React.Dispatch<CharDataAction>;
};

export default function CharacterSheet(props: Props) {
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

  function getInitiativeBonus(): number {
    return addBonuses(getAbilityMod(props.charData.abilities.dex), props.charData.initiative_adds);
  }

  function getAC() {
    return addBonuses(10 + getAbilityMod(props.charData.abilities.dex), props.charData.ac_adds);
  }

  function getAbilityTotal(ability: AbilityData) {
    return addBonuses(ability.score, ability.score_adds);
  }

  function getAbilityMod(ability: AbilityData) {
    let score = addBonuses(ability.score, ability.score_adds);
    let mod = 0;
    if (score <= 8) {
      mod = Math.ceil(Math.abs(10 - score) / 2) * -1;
    } else if (score >= 12) {
      mod = Math.floor((score - 10) / 2);
    }
    return mod;
  }

  function getSavingThrowMod(ability: AbilityData) {
    let proficiency = ability.proficient ? props.charData.proficiency_bonus : 0;
    return addBonuses(getAbilityMod(ability) + proficiency, ability.save_adds);
  }

  function getSkillMod(skill: SkillData) {
    let proficiency = props.charData.proficiency_bonus * skill.proficiency_multiplier;
    let abilityDataMap = new Map([
      [Ability.str, props.charData.abilities.str],
      [Ability.dex, props.charData.abilities.dex],
      [Ability.con, props.charData.abilities.con],
      [Ability.int, props.charData.abilities.int],
      [Ability.wis, props.charData.abilities.wis],
      [Ability.cha, props.charData.abilities.cha],
    ]);
    let abilityData = abilityDataMap.get(skill.ability);
    let abilityMod = 0;
    if (abilityData) {
      abilityMod = getAbilityMod(abilityData);
    }
    return addBonuses(abilityMod + proficiency, skill.adds);
  }

  function addBonuses(base: number, adds: Bonus[]) {
    let addsTotal = 0;
    adds.forEach((add) => {
      addsTotal += add.flat;
    });
    return base + addsTotal;
  }

  function displayBonus(bonus: number): string {
    return bonus >= 0 ? "+" + bonus : "" + bonus;
  }

  function displayHitDice(displayType: "remaining" | "total") {
    let result = "";
    props.charData.hitDice.forEach((hd: HitDice) => {
      let nextDice = displayType == "remaining" ? hd.remaining : hd.total;
      if (nextDice > 0) {
        result += nextDice + "d" + hd.type + "  ";
      }
    });
    return result;
  }

  function stringArrayToString(strings: string[]) {
    let result = "";
    strings.forEach((e: string) => {
      result += e + "\n";
    });
    return result;
  }

  return (
    <div id="sheet">
      {/* 1st row */}
      <div className="sheet-grouping sheet-row">
        <div id="sheet-con-charname">
          <label id="sheet-data-charname">{props.charData.name}</label>
        </div>
        <div id="sheet-con-classlevel">
          <label id="sheet-data-classlevel">{props.charData.classLevel}</label>
          <br />
        </div>
        <div id="sheet-con-lineage">
          <label id="sheet-data-lineage">
            {props.charData.sublineage ? props.charData.sublineage : props.charData.lineage}
          </label>
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
                openDiceRoller(event, "1d20", getInitiativeBonus());
              }}
            >
              {displayBonus(getInitiativeBonus())}
            </button>
          </div>
          <div id="sheet-con-ac">
            <label>AC</label>
            <br />
            <label id="sheet-data-ac">{getAC()}</label>
          </div>
          <div id="sheet-con-inspiration">
            <label>Inspiration</label>
            <br />
            <input
              disabled
              type="checkbox"
              id="sheet-data-inspiration"
              checked={props.charData.inspiration}
              onChange={() => {}}
            ></input>
          </div>
        </div>
        <div className="sheet-grouping sheet-row" id="sheet-con-group-hp">
          <label className="label-heading">Hit Points</label>
          <div className="sheet-field-annotated">
            <label className="sheet-de-emphasized">Current</label>
            <label id="sheet-data-hp-current">{props.charData.hp.current}</label>
          </div>
          <div className="sheet-field-annotated">
            <label className="sheet-de-emphasized">Maximum</label>
            <label id="sheet-data-hp-max">
              {addBonuses(props.charData.hp.max, props.charData.hp.max_adds)}
            </label>
          </div>
          <div className="sheet-field-annotated">
            <label className="sheet-de-emphasized">Temporary</label>
            <label id="sheet-data-hp-temp">{props.charData.hp.temp}</label>
          </div>
        </div>
        <div className="sheet-grouping sheet-row" id="sheet-con-group-hitdice">
          <label className="label-heading">Hit Dice</label>
          <div className="sheet-field-annotated">
            <label className="sheet-de-emphasized">Remaining</label>
            <label id="sheet-data-hitdice-remaining">{displayHitDice("remaining")}</label>
          </div>
          <span className="gap-vertical" />
          <div className="sheet-field-annotated">
            <label className="sheet-de-emphasized">Total</label>
            <label id="sheet-data-hitdice-total">{displayHitDice("total")}</label>
          </div>
        </div>
        <div className="sheet-grouping sheet-row" id="sheet-con-group-conditions">
          <div id="sheet-con-conditions">
            <label>Conditions</label>
            <br />
            <textarea
              disabled
              id="sheet-data-conditions"
              value={stringArrayToString(props.charData.conditions)}
            ></textarea>
          </div>
        </div>
      </div>

      {/* 3rd row */}
      <div className="sheet-grouping sheet-row">
        <div className="sheet-row" id="sheet-con-group-anatomy">
          <div id="sheet-con-speed">
            <label>Speed</label>
            <br />
            <label id="sheet-data-speed">{props.charData.speed + " ft."}</label>
          </div>
          <div id="sheet-con-creaturetype">
            <label>Creature Type</label>
            <br />
            <label id="sheet-data-creaturetype">{props.charData.creatureType}</label>
          </div>
          <div id="sheet-con-size">
            <label>Size</label>
            <br />
            <label id="sheet-data-size">{CreatureSize[props.charData.size]}</label>
          </div>
          <div id="sheet-con-senses">
            <label>Senses</label>
            <br />
            <label id="sheet-data-senses">
              {props.charData.senses
                ?.map((sense: any) => sense.name + " " + sense.range + "ft.")
                .join(", ")}
            </label>
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
                  <input disabled value={getAbilityTotal(props.charData.abilities.str)}></input>
                </div>
                <div className="sheet-row">
                  <label className="sheet-de-emphasized">Mod</label>
                  <button
                    className="sheet-button-tiny"
                    onClick={(e) => {
                      openDiceRoller(e, "1d20", getAbilityMod(props.charData.abilities.str));
                    }}
                  >
                    {displayBonus(getAbilityMod(props.charData.abilities.str))}
                  </button>
                </div>
                <div className="sheet-row">
                  <label className="sheet-de-emphasized">Save</label>
                  <button
                    className="sheet-button-tiny"
                    onClick={(e) => {
                      openDiceRoller(e, "1d20", getSavingThrowMod(props.charData.abilities.str));
                    }}
                  >
                    {displayBonus(getSavingThrowMod(props.charData.abilities.str))}
                  </button>
                </div>
              </div>
              <div className="sheet-grouping sheet-con-ability sheet-column" id="sheet-con-dex">
                <div className="sheet-row">
                  <label>{"Dexterity:"}</label>
                  <input disabled value={getAbilityTotal(props.charData.abilities.dex)}></input>
                </div>
                <div className="sheet-row">
                  <label className="sheet-de-emphasized">Mod</label>
                  <button
                    className="sheet-button-tiny"
                    onClick={(e) => {
                      openDiceRoller(e, "1d20", getAbilityMod(props.charData.abilities.dex));
                    }}
                  >
                    {displayBonus(getAbilityMod(props.charData.abilities.dex))}
                  </button>
                </div>
                <div className="sheet-row">
                  <label className="sheet-de-emphasized">Save</label>
                  <button
                    className="sheet-button-tiny"
                    onClick={(e) => {
                      openDiceRoller(e, "1d20", getSavingThrowMod(props.charData.abilities.dex));
                    }}
                  >
                    {displayBonus(getSavingThrowMod(props.charData.abilities.dex))}
                  </button>
                </div>
              </div>
              <div className="sheet-grouping sheet-con-ability sheet-column" id="sheet-con-con">
                <div className="sheet-row">
                  <label>{"Consitution:"}</label>
                  <input disabled value={getAbilityTotal(props.charData.abilities.con)}></input>
                </div>
                <div className="sheet-row">
                  <label className="sheet-de-emphasized">Mod</label>
                  <button
                    className="sheet-button-tiny"
                    onClick={(e) => {
                      openDiceRoller(e, "1d20", getAbilityMod(props.charData.abilities.con));
                    }}
                  >
                    {displayBonus(getAbilityMod(props.charData.abilities.con))}
                  </button>
                </div>
                <div className="sheet-row">
                  <label className="sheet-de-emphasized">Save</label>
                  <button
                    className="sheet-button-tiny"
                    onClick={(e) => {
                      openDiceRoller(e, "1d20", getSavingThrowMod(props.charData.abilities.con));
                    }}
                  >
                    {displayBonus(getSavingThrowMod(props.charData.abilities.con))}
                  </button>
                </div>
              </div>
              <div className="sheet-grouping sheet-con-ability sheet-column" id="sheet-con-int">
                <div className="sheet-row">
                  <label>{"Intelligence:"}</label>
                  <input disabled value={getAbilityTotal(props.charData.abilities.int)}></input>
                </div>
                <div className="sheet-row">
                  <label className="sheet-de-emphasized">Mod</label>
                  <button
                    className="sheet-button-tiny"
                    onClick={(e) => {
                      openDiceRoller(e, "1d20", getAbilityMod(props.charData.abilities.int));
                    }}
                  >
                    {displayBonus(getAbilityMod(props.charData.abilities.int))}
                  </button>
                </div>
                <div className="sheet-row">
                  <label className="sheet-de-emphasized">Save</label>
                  <button
                    className="sheet-button-tiny"
                    onClick={(e) => {
                      openDiceRoller(e, "1d20", getSavingThrowMod(props.charData.abilities.int));
                    }}
                  >
                    {displayBonus(getSavingThrowMod(props.charData.abilities.int))}
                  </button>
                </div>
              </div>
              <div className="sheet-grouping sheet-con-ability sheet-column" id="sheet-con-wis">
                <div className="sheet-row">
                  <label>{"Wisdom:"}</label>
                  <input disabled value={getAbilityTotal(props.charData.abilities.wis)}></input>
                </div>
                <div className="sheet-row">
                  <label className="sheet-de-emphasized">Mod</label>
                  <button
                    className="sheet-button-tiny"
                    onClick={(e) => {
                      openDiceRoller(e, "1d20", getAbilityMod(props.charData.abilities.wis));
                    }}
                  >
                    {displayBonus(getAbilityMod(props.charData.abilities.wis))}
                  </button>
                </div>
                <div className="sheet-row">
                  <label className="sheet-de-emphasized">Save</label>
                  <button
                    className="sheet-button-tiny"
                    onClick={(e) => {
                      openDiceRoller(e, "1d20", getSavingThrowMod(props.charData.abilities.wis));
                    }}
                  >
                    {displayBonus(getSavingThrowMod(props.charData.abilities.wis))}
                  </button>
                </div>
              </div>
              <div className="sheet-grouping sheet-con-ability sheet-column" id="sheet-con-cha">
                <div className="sheet-row">
                  <label>{"Charisma:"}</label>
                  <input disabled value={getAbilityTotal(props.charData.abilities.cha)}></input>
                </div>
                <div className="sheet-row">
                  <label className="sheet-de-emphasized">Mod</label>
                  <button
                    className="sheet-button-tiny"
                    onClick={(e) => {
                      openDiceRoller(e, "1d20", getAbilityMod(props.charData.abilities.cha));
                    }}
                  >
                    {displayBonus(getAbilityMod(props.charData.abilities.cha))}
                  </button>
                </div>
                <div className="sheet-row">
                  <label className="sheet-de-emphasized">Save</label>
                  <button
                    className="sheet-button-tiny"
                    onClick={(e) => {
                      openDiceRoller(e, "1d20", getSavingThrowMod(props.charData.abilities.cha));
                    }}
                  >
                    {displayBonus(getSavingThrowMod(props.charData.abilities.cha))}
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
                value={displayBonus(props.charData.proficiency_bonus)}
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
                  openDiceRoller(e, "1d20", getSkillMod(props.charData.skills.acrobatics));
                }}
              >
                {displayBonus(getSkillMod(props.charData.skills.acrobatics))}
              </button>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={props.charData.skills.acrobatics.proficiency_multiplier == 1}
              ></input>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={props.charData.skills.acrobatics.proficiency_multiplier == 2}
              ></input>
              <label>Animal Handling</label>
              <button
                className="sheet-button-tiny"
                onClick={(e) => {
                  openDiceRoller(e, "1d20", getSkillMod(props.charData.skills.animal_handling));
                }}
              >
                {displayBonus(getSkillMod(props.charData.skills.animal_handling))}
              </button>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={props.charData.skills.animal_handling.proficiency_multiplier == 1}
              ></input>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={props.charData.skills.animal_handling.proficiency_multiplier == 2}
              ></input>
              <label>Arcana</label>
              <button
                className="sheet-button-tiny"
                onClick={(e) => {
                  openDiceRoller(e, "1d20", getSkillMod(props.charData.skills.arcana));
                }}
              >
                {displayBonus(getSkillMod(props.charData.skills.arcana))}
              </button>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={props.charData.skills.arcana.proficiency_multiplier == 1}
              ></input>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={props.charData.skills.arcana.proficiency_multiplier == 2}
              ></input>
              <label>Athletics</label>
              <button
                className="sheet-button-tiny"
                onClick={(e) => {
                  openDiceRoller(e, "1d20", getSkillMod(props.charData.skills.athletics));
                }}
              >
                {displayBonus(getSkillMod(props.charData.skills.athletics))}
              </button>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={props.charData.skills.athletics.proficiency_multiplier == 1}
              ></input>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={props.charData.skills.athletics.proficiency_multiplier == 2}
              ></input>
              <label>Deception</label>
              <button
                className="sheet-button-tiny"
                onClick={(e) => {
                  openDiceRoller(e, "1d20", getSkillMod(props.charData.skills.deception));
                }}
              >
                {displayBonus(getSkillMod(props.charData.skills.deception))}
              </button>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={props.charData.skills.deception.proficiency_multiplier == 1}
              ></input>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={props.charData.skills.deception.proficiency_multiplier == 2}
              ></input>
              <label>History</label>
              <button
                className="sheet-button-tiny"
                onClick={(e) => {
                  openDiceRoller(e, "1d20", getSkillMod(props.charData.skills.history));
                }}
              >
                {displayBonus(getSkillMod(props.charData.skills.history))}
              </button>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={props.charData.skills.history.proficiency_multiplier == 1}
              ></input>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={props.charData.skills.history.proficiency_multiplier == 2}
              ></input>
              <label>Insight</label>
              <button
                className="sheet-button-tiny"
                onClick={(e) => {
                  openDiceRoller(e, "1d20", getSkillMod(props.charData.skills.insight));
                }}
              >
                {displayBonus(getSkillMod(props.charData.skills.insight))}
              </button>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={props.charData.skills.insight.proficiency_multiplier == 1}
              ></input>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={props.charData.skills.insight.proficiency_multiplier == 2}
              ></input>
              <label>Intimidation</label>
              <button
                className="sheet-button-tiny"
                onClick={(e) => {
                  openDiceRoller(e, "1d20", getSkillMod(props.charData.skills.intimidation));
                }}
              >
                {displayBonus(getSkillMod(props.charData.skills.intimidation))}
              </button>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={props.charData.skills.intimidation.proficiency_multiplier == 1}
              ></input>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={props.charData.skills.intimidation.proficiency_multiplier == 2}
              ></input>
              <label>Investigation</label>
              <button
                className="sheet-button-tiny"
                onClick={(e) => {
                  openDiceRoller(e, "1d20", getSkillMod(props.charData.skills.investigation));
                }}
              >
                {displayBonus(getSkillMod(props.charData.skills.investigation))}
              </button>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={props.charData.skills.investigation.proficiency_multiplier == 1}
              ></input>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={props.charData.skills.investigation.proficiency_multiplier == 2}
              ></input>
              <label>Medicine</label>
              <button
                className="sheet-button-tiny"
                onClick={(e) => {
                  openDiceRoller(e, "1d20", getSkillMod(props.charData.skills.medicine));
                }}
              >
                {displayBonus(getSkillMod(props.charData.skills.medicine))}
              </button>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={props.charData.skills.medicine.proficiency_multiplier == 1}
              ></input>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={props.charData.skills.medicine.proficiency_multiplier == 2}
              ></input>
              <label>Nature</label>
              <button
                className="sheet-button-tiny"
                onClick={(e) => {
                  openDiceRoller(e, "1d20", getSkillMod(props.charData.skills.nature));
                }}
              >
                {displayBonus(getSkillMod(props.charData.skills.nature))}
              </button>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={props.charData.skills.nature.proficiency_multiplier == 1}
              ></input>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={props.charData.skills.nature.proficiency_multiplier == 2}
              ></input>
              <label>Perception</label>
              <button
                className="sheet-button-tiny"
                onClick={(e) => {
                  openDiceRoller(e, "1d20", getSkillMod(props.charData.skills.perception));
                }}
              >
                {displayBonus(getSkillMod(props.charData.skills.perception))}
              </button>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={props.charData.skills.perception.proficiency_multiplier == 1}
              ></input>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={props.charData.skills.perception.proficiency_multiplier == 2}
              ></input>
              <label>Performance</label>
              <button
                className="sheet-button-tiny"
                onClick={(e) => {
                  openDiceRoller(e, "1d20", getSkillMod(props.charData.skills.performance));
                }}
              >
                {displayBonus(getSkillMod(props.charData.skills.performance))}
              </button>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={props.charData.skills.performance.proficiency_multiplier == 1}
              ></input>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={props.charData.skills.performance.proficiency_multiplier == 2}
              ></input>
              <label>Persuasion</label>
              <button
                className="sheet-button-tiny"
                onClick={(e) => {
                  openDiceRoller(e, "1d20", getSkillMod(props.charData.skills.persuasion));
                }}
              >
                {displayBonus(getSkillMod(props.charData.skills.persuasion))}
              </button>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={props.charData.skills.persuasion.proficiency_multiplier == 1}
              ></input>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={props.charData.skills.persuasion.proficiency_multiplier == 2}
              ></input>
              <label>Religion</label>
              <button
                className="sheet-button-tiny"
                onClick={(e) => {
                  openDiceRoller(e, "1d20", getSkillMod(props.charData.skills.religion));
                }}
              >
                {displayBonus(getSkillMod(props.charData.skills.religion))}
              </button>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={props.charData.skills.religion.proficiency_multiplier == 1}
              ></input>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={props.charData.skills.religion.proficiency_multiplier == 2}
              ></input>
              <label>Sleight of Hand</label>
              <button
                className="sheet-button-tiny"
                onClick={(e) => {
                  openDiceRoller(e, "1d20", getSkillMod(props.charData.skills.sleight_of_hand));
                }}
              >
                {displayBonus(getSkillMod(props.charData.skills.sleight_of_hand))}
              </button>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={props.charData.skills.sleight_of_hand.proficiency_multiplier == 1}
              ></input>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={props.charData.skills.sleight_of_hand.proficiency_multiplier == 2}
              ></input>
              <label>Stealth</label>
              <button
                className="sheet-button-tiny"
                onClick={(e) => {
                  openDiceRoller(e, "1d20", getSkillMod(props.charData.skills.stealth));
                }}
              >
                {displayBonus(getSkillMod(props.charData.skills.stealth))}
              </button>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={props.charData.skills.stealth.proficiency_multiplier == 1}
              ></input>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={props.charData.skills.stealth.proficiency_multiplier == 2}
              ></input>
              <label>Survival</label>
              <button
                className="sheet-button-tiny"
                onClick={(e) => {
                  openDiceRoller(e, "1d20", getSkillMod(props.charData.skills.survival));
                }}
              >
                {displayBonus(getSkillMod(props.charData.skills.survival))}
              </button>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={props.charData.skills.survival.proficiency_multiplier == 1}
              ></input>
              <input
                disabled
                className="sheet-skill-prof"
                type="checkbox"
                checked={props.charData.skills.survival.proficiency_multiplier == 2}
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
                  value={Util.ListDistinct(
                    props.charData.languages.map((lang) => lang.language),
                    ", "
                  )}
                ></textarea>
              </div>
              <div>
                <label className="label-heading">Tool Proficiencies</label>
                <br />
                <textarea disabled value={props.charData.tool_prof}></textarea>
              </div>
              <div>
                <label className="label-heading">Armor & Weapon Proficiencies</label>
                <br />
                <textarea disabled value={props.charData.armor_weapon_prof}></textarea>
              </div>
            </div>

            {/* inventory*/}
            <div className="sheet-grouping sheet-column" id="sheet-con-group-inventory">
              <label>Inventory</label>
              <br />
              <textarea disabled value={props.charData.inventory}></textarea>
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
              {props.charData.features.map((feature) => (
                <div className="sheet-column" key={feature.name}>
                  <label className="label-heading">{feature.name}</label>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          ) : null}
          {selectedActionsTab === "actions" ? (
            <div className="sheet-sections">
              {props.charData.spells
                .filter((spell) => spell.casting_time == CastingTime.Action)
                .map((spell) => (
                  <div className="sheet-column" key={spell.name}>
                    <label className="label-heading">{spell.name}</label>
                    <p>{spell.description}</p>
                  </div>
                ))}
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
                    charData={props.charData}
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
