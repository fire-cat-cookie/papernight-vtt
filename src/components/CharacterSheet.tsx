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
import Collapsible from "./Collapsible";
import * as GetStaticData from "../operations/GetStaticData";
import { GameUtil } from "../operations/GameUtil";
import { Feature } from "../types/Feature";
import { Spell } from "../types/Spell";

type Props = {
  char: CharComposed;
  updateCharData: React.Dispatch<CharDataAction>;
};

export default function CharacterSheet(props: Props) {
  let char = props.char;

  const [diceRollerVisible, setDiceRollerVisible] = useState(false);
  const [nextRoll, setNextRoll] = useState({ dice: "1d20", bonus: 0 });
  const [diceRollerPosition, setDiceRollerPosition] = useState({ x: 0, y: 0 });
  const [selectedTab, setSelectedTab] = useState("Common");

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

    for (let die of dice) {
      result += die.amount + "d" + die.sides + "  ";
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
              {displayHitDice(char.hit_dice_remaining)}
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

  function renderTab(tabName: string) {
    return (
      <button
        className={selectedTab === tabName ? "sheet-tab sheet-tab-active" : "sheet-tab"}
        onClick={() => setSelectedTab(tabName)}
      >
        {tabName}
      </button>
    );
  }

  function renderTabContent(tabName: string) {
    if (selectedTab === tabName && tabName === "Features") {
      return renderFeaturesTabContent();
    } else if (selectedTab === tabName && tabName === "Spells") {
      return renderSpellsTabContent();
    } else {
      return null;
    }
  }

  function renderSpellsTabContent() {
    let gainSpellsFeatures = char.features.filter((f) => f.feature.gainSpells != undefined);

    let featuresContent = gainSpellsFeatures.map((f) =>
      (f.feature.gainSpells?.selected?.length ?? 0) == 0 ? null : (
        <div className="sheet-column" key={f.source + " " + f.feature.name}>
          <h4>{f.feature.name}</h4>
          {featureSpellsContent(f)}
        </div>
      ),
    );

    function featureSpellsContent(f: { feature: Feature; source: string }) {
      let spells: Spell[] = [];
      for (let s of f.feature.gainSpells.selected ?? []) {
        let foundSpell = GetStaticData.getSpell(s.name);
        if (foundSpell) {
          spells.push(foundSpell);
        }
      }
      return spells.map((s) => SpellContent(s));
    }

    function SpellContent(s: Spell) {
      return (
        <div className="sheet-column" key={s.name}>
          <Collapsible
            heading={s.name}
            className={"label-heading"}
            content={GameUtil.DisplayMarkdown(s.description)}
          ></Collapsible>
        </div>
      );
    }
    function SpellcastingContent() {
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
      let spellsGroupedByLevel: {
        group: string;
        spells: Spell[];
        slotsTotal: number;
        slotsAvailable: number;
      }[] = [];
      let spellsSortedByLevel = char.classSpells.sort((a, b) => a.spell.level - b.spell.level);
      let spellSlots = char.spellSlots;
      for (let slotLevel = 0; slotLevel < 10; slotLevel++) {
        spellsGroupedByLevel.push({
          group: levelsAsText[slotLevel],
          spells:
            spellsSortedByLevel.filter((s) => s.spell.level == slotLevel)?.map((s) => s.spell) ??
            [],
          slotsTotal: slotLevel == 0 ? 0 : spellSlots[slotLevel - 1].total,
          slotsAvailable: slotLevel == 0 ? 0 : spellSlots[slotLevel - 1].available,
        });
      }
      return (
        <>
          {spellsSortedByLevel.length > 0 && <h4>Class spells</h4>}
          <span>Spell slots</span>
          <div id="sheet-con-spellslots">
            <div>1</div>
            <div>2</div>
            <div>3</div>
            <div>4</div>
            <div>5</div>
            <div>6</div>
            <div>7</div>
            <div>8</div>
            <div>9</div>
            <div>
              {spellsGroupedByLevel[1].slotsAvailable + "/" + spellsGroupedByLevel[1].slotsTotal}
            </div>
            <div>
              {spellsGroupedByLevel[2].slotsAvailable + "/" + spellsGroupedByLevel[2].slotsTotal}
            </div>
            <div>
              {spellsGroupedByLevel[3].slotsAvailable + "/" + spellsGroupedByLevel[3].slotsTotal}
            </div>
            <div>
              {spellsGroupedByLevel[4].slotsAvailable + "/" + spellsGroupedByLevel[4].slotsTotal}
            </div>
            <div>
              {spellsGroupedByLevel[5].slotsAvailable + "/" + spellsGroupedByLevel[5].slotsTotal}
            </div>
            <div>
              {spellsGroupedByLevel[6].slotsAvailable + "/" + spellsGroupedByLevel[6].slotsTotal}
            </div>
            <div>
              {spellsGroupedByLevel[7].slotsAvailable + "/" + spellsGroupedByLevel[7].slotsTotal}
            </div>
            <div>
              {spellsGroupedByLevel[8].slotsAvailable + "/" + spellsGroupedByLevel[8].slotsTotal}
            </div>
            <div>
              {spellsGroupedByLevel[9].slotsAvailable + "/" + spellsGroupedByLevel[9].slotsTotal}
            </div>
          </div>
          {spellsGroupedByLevel.map((grouping) =>
            grouping.spells.length == 0 && grouping.slotsTotal == 0 ? null : (
              <React.Fragment key={grouping.group}>
                <span>
                  {grouping.group == "Cantrips"
                    ? grouping.group
                    : grouping.group + " " + grouping.slotsAvailable + "/" + grouping.slotsTotal}
                </span>
                {grouping.spells.map((s) => SpellContent(s))}
              </React.Fragment>
            ),
          )}
        </>
      );
    }
    return (
      <div className="sheet-sections sheet-feature-list">
        {featuresContent}
        {SpellcastingContent()}
      </div>
    );
  }

  function renderFeaturesTabContent() {
    let hiddenFeatures = GameUtil.GetHiddenFeatures();
    let featuresFiltered = char.features.filter(
      (f) =>
        !f.feature.abilityScoreImprovement &&
        !f.feature.gainSubclassFeature &&
        hiddenFeatures.indexOf(f.feature.name) == -1,
    );

    function featureContent(f: Feature, source: string) {
      let limitedUse = "";
      if (f.limitedUse) {
        limitedUse = " [ " + f.limitedUse.uses + " / " + f.limitedUse.recharge + " ]";
      }
      let heading = f.name + limitedUse;
      let key = source + " " + f.level + " " + f.name;

      return (
        <div className="sheet-column" key={key}>
          <Collapsible
            heading={heading}
            className={"label-heading"}
            content={GameUtil.DisplayFeatureDescription(f, true)}
          ></Collapsible>
        </div>
      );
    }

    let featuresContent = featuresFiltered.map((f) => featureContent(f.feature, f.source));
    for (let feature of featuresFiltered) {
      let choices = feature.feature.choices?.selected ?? [];
      featuresContent.push(...choices.map((f) => featureContent(f, feature.source)));
    }

    return <div className="sheet-sections sheet-feature-list">{featuresContent}</div>;
  }

  function renderActionsAndFeatures() {
    return (
      <div className="sheet-grouping sheet-column" id="sheet-con-group-traits">
        <div className="sheet-tab-row" id="sheet-tab-row-actions">
          {renderTab("Common")}
          {renderTab("Features")}
          {renderTab("Spells")}
          {renderTab("Equipment")}
        </div>
        {renderTabContent("Common")}
        {renderTabContent("Features")}
        {renderTabContent("Spells")}
        {renderTabContent("Equipment")}
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
