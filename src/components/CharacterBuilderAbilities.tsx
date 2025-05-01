import { useState } from "react";
import { CharDataAction } from "../operations/CharDataReducer";
import { Ability } from "../types/Ability";
import { CharComposed } from "../types/CharComposed";
import { CharData } from "../types/CharData";
import "./CharacterBuilder.scss";
import "./CharacterBuilderAbilities.scss";
import { GameUtil } from "../operations/GameUtil";

type Props = {
  charData: CharData;
  charComposed: CharComposed;
  updateCharData: React.Dispatch<CharDataAction>;
};

type PositionedNumber = {
  value: number;
  position: number;
};

export default function CharacterBuilderAbilities(props: Props) {
  let charData = props.charData;
  let charComposed = props.charComposed;
  const [generationMethod, setGenerationMethod] = useState("");
  let minScore = getMinMaxScore().min;
  let maxScore = getMinMaxScore().max;
  let maxPoints = 27;
  let standardArray = [15, 14, 13, 12, 10, 8];
  let inputVisible = ["Manual", "Point Buy", ""].indexOf(generationMethod) != -1;
  let dropdownVisible = ["Rolled", "Standard Array"].indexOf(generationMethod) != -1;
  const [numbersAvailable, setNumbersAvailable] = useState<number[]>([]);
  const [numbersChosen, setNumbersChosen] = useState<PositionedNumber[]>(initialNumbersChosen());

  function initialNumbersChosen() {
    return [
      { position: -1, value: 8 },
      { position: -1, value: 8 },
      { position: -1, value: 8 },
      { position: -1, value: 8 },
      { position: -1, value: 8 },
      { position: -1, value: 8 },
    ];
  }

  function pointsRemaining() {
    return Math.min(
      27,
      maxPoints - pointCost(charData.base_ability_scores.map((a) => a.score).flat(1))
    );
  }

  function pointCost(scores: number[]) {
    let total = 0;
    for (let value of scores) {
      if (value < 14) {
        total += value - 8;
      } else if (value == 14) {
        total += 7;
      } else if (value == 15) {
        total += 9;
      }
    }
    return total;
  }

  function chooseNumber(value: PositionedNumber, index: number, ability: Ability) {
    let newNumbers = numbersChosen.slice();
    newNumbers[index] = value;
    setNumbersChosen(newNumbers);
    props.updateCharData({ type: "set-ability-score", ability: ability, value: value.value });
  }

  function numbersAvailableForIndex(index: number): PositionedNumber[] {
    let numbersAllowed = [];
    for (let i = 0; i < numbersAvailable.length; i++) {
      numbersAllowed.push({ value: numbersAvailable[i], position: i });
    }
    for (let i = 0; i < numbersChosen.length; i++) {
      let foundIndex = -1;
      for (let ii = 0; ii < numbersAllowed.length; ii++) {
        if (
          numbersAllowed[ii].position == numbersChosen[i].position &&
          numbersAllowed[ii].value == numbersChosen[i].value &&
          i != index
        ) {
          foundIndex = ii;
        }
      }
      if (foundIndex != -1) {
        numbersAllowed.splice(foundIndex, 1);
      }
    }
    return numbersAllowed;
  }

  function displayBonus(ability: Ability) {
    let baseScore = charData.base_ability_scores?.find((a) => a.ability == ability)?.score ?? 0;
    let totalScore = charComposed.abilities?.find((a) => a.ability == ability)?.score ?? 0;
    let result = totalScore - baseScore;
    return result >= 1 ? "+" + result : "" + result;
  }

  function displayModifier(ability: Ability) {
    let result = charComposed.abilities.find((a) => a.ability == ability)?.mod ?? 0;
    return result >= 0 ? "+" + result : "" + result;
  }

  function displayBaseScore(ability: Ability) {
    return charData.base_ability_scores?.find((a) => a.ability == ability)?.score ?? 0;
  }

  function displayTotal(ability: Ability) {
    return charComposed.abilities?.find((a) => a.ability == ability)?.score ?? 0;
  }

  function getMinMaxScore(): { min: number; max: number } {
    switch (generationMethod) {
      case "Rolled":
        return { min: 3, max: 18 };
      case "Manual":
        return { min: 1, max: 20 };
      case "Point Buy":
      case "Standard Array":
        return { min: 8, max: 15 };
      default:
        return { min: 0, max: 20 };
    }
  }

  function displayNumbersRolled() {
    if (numbersAvailable.indexOf(0) == -1) {
      return (
        numbersAvailable.join(", ") +
        " (Total: " +
        numbersAvailable.reduce((a, b) => a + b, 0) +
        ")"
      );
    }
    return "";
  }

  function rollNumbers() {
    let newScores = [];
    for (let i = 0; i < 6; i++) {
      let score = [];
      for (let j = 0; j < 4; j++) {
        score.push(GameUtil.Roll(1, 6));
      }
      score.sort((a, b) => b - a);
      score.pop();
      newScores.push(score[0] + score[1] + score[2]);
    }
    newScores.sort((a, b) => b - a);
    setNumbersAvailable(newScores);
  }

  function resetNumbersChosen() {
    chooseNumber({ value: 8, position: -1 }, 0, Ability.str);
    chooseNumber({ value: 8, position: -1 }, 1, Ability.dex);
    chooseNumber({ value: 8, position: -1 }, 2, Ability.con);
    chooseNumber({ value: 8, position: -1 }, 3, Ability.int);
    chooseNumber({ value: 8, position: -1 }, 4, Ability.wis);
    chooseNumber({ value: 8, position: -1 }, 5, Ability.cha);
    setNumbersChosen(initialNumbersChosen());
  }

  return (
    <div className="builder-tab-content builder-sections" id="builder-abilities">
      <section className="builder-section">
        <div className="builder-group">
          <label htmlFor="generation-method">Generation Method:</label>
          <select
            name="generation-method"
            id="generation-method"
            value={generationMethod}
            onChange={(e) => {
              setGenerationMethod(e.target.value);
              if (e.target.value == "Standard Array") {
                setNumbersAvailable(standardArray);
                resetNumbersChosen();
              }
              if (e.target.value == "Rolled") {
                setNumbersAvailable([]);
                resetNumbersChosen();
              }
            }}
          >
            <option key="" value=""></option>
            <option key={"Rolled"}>Rolled</option>
            <option key={"Point Buy"}>Point Buy</option>
            <option key={"Standard Array"}>Standard Array</option>
            <option key={"Manual"}>Manual</option>
          </select>
        </div>
      </section>
      {generationMethod == "Point Buy" ? (
        <section className="builder-section">
          <div className="builder-con-group">
            <label>Remaining Points:</label>
            <p>{pointsRemaining()}</p>
          </div>
        </section>
      ) : null}
      {generationMethod == "Standard Array" ? (
        <section className="builder-section">
          <div className="builder-con-group">
            <label>Numbers available: </label>
            <p>{standardArray.join(", ")}</p>
          </div>
        </section>
      ) : null}
      {generationMethod == "Rolled" ? (
        <section className="builder-section">
          <div className="builder-con-group">
            <button
              className="builder-abilities-roll-button"
              onClick={() => {
                rollNumbers();
                resetNumbersChosen();
              }}
            >
              Roll
            </button>
          </div>
          <div className="builder-con-group">
            <label>Numbers rolled: </label>
            <p>{displayNumbersRolled()}</p>
          </div>
        </section>
      ) : null}
      <section className="builder-section">
        <div className="builder-con-abilities">
          {/*Headings*/}
          <div className="builder-abilities-heading">Attribute</div>
          <div className="builder-abilities-heading">Ability Score</div>
          <div className="builder-abilities-heading">Bonus</div>
          <div className="builder-abilities-heading">Total</div>
          <div className="builder-abilities-heading">Ability Modifier</div>
          {/*Strength*/}
          <div className="builder-abilities-col builder-abilities-col-attribute">Strength</div>
          <div className="builder-abilities-col builder-abilities-col-score">
            {inputVisible ? (
              <input
                className={
                  "builder-abilities-input" +
                  (generationMethod == "" ? " builder-abilities-input-disabled" : "")
                }
                type="number"
                min={minScore}
                max={maxScore}
                value={displayBaseScore(Ability.str)}
                disabled={generationMethod == ""}
                onChange={(e) =>
                  props.updateCharData({
                    type: "set-ability-score",
                    ability: Ability.str,
                    value: +e.target.value,
                  })
                }
              ></input>
            ) : null}
            {dropdownVisible ? (
              <select
                className="builder-abilities-select"
                onChange={(e) => {
                  chooseNumber(JSON.parse(e.target.value), 0, Ability.str);
                }}
              >
                <option key="" value={JSON.stringify({ value: 8, position: -1 })}></option>
                {numbersAvailableForIndex(0).map((n: PositionedNumber) => {
                  return (
                    <option key={n.position + " " + n.value} value={JSON.stringify(n)}>
                      {n.value}
                    </option>
                  );
                })}
              </select>
            ) : null}
          </div>
          <div className="builder-abilities-col builder-abilities-col-bonus">
            {displayBonus(Ability.str)}
          </div>
          <div className="builder-abilities-col builder-abilities-col-total">
            {displayTotal(Ability.str)}
          </div>
          <div className="builder-abilities-col builder-abilities-col-modifier">
            {displayModifier(Ability.str)}
          </div>
          {/*Dexterity*/}
          <div className="builder-abilities-col builder-abilities-col-attribute">Dexterity</div>
          <div className="builder-abilities-col builder-abilities-col-score">
            {inputVisible ? (
              <input
                className={
                  "builder-abilities-input" +
                  (generationMethod == "" ? " builder-abilities-input-disabled" : "")
                }
                type="number"
                min={minScore}
                max={maxScore}
                value={displayBaseScore(Ability.dex)}
                disabled={generationMethod == ""}
                onChange={(e) =>
                  props.updateCharData({
                    type: "set-ability-score",
                    ability: Ability.dex,
                    value: +e.target.value,
                  })
                }
              ></input>
            ) : null}
            {dropdownVisible ? (
              <select
                className="builder-abilities-select"
                onChange={(e) => {
                  chooseNumber(JSON.parse(e.target.value), 1, Ability.dex);
                }}
              >
                <option key="" value={0}></option>
                {numbersAvailableForIndex(1).map((n: PositionedNumber) => {
                  return (
                    <option key={n.position + " " + n.value} value={JSON.stringify(n)}>
                      {n.value}
                    </option>
                  );
                })}
              </select>
            ) : null}
          </div>
          <div className="builder-abilities-col builder-abilities-col-bonus">
            {displayBonus(Ability.dex)}
          </div>
          <div className="builder-abilities-col builder-abilities-col-total">
            {displayTotal(Ability.dex)}
          </div>
          <div className="builder-abilities-col builder-abilities-col-modifier">
            {displayModifier(Ability.dex)}
          </div>
          {/*Constitution*/}
          <div className="builder-abilities-col builder-abilities-col-attribute">Constitution</div>
          <div className="builder-abilities-col builder-abilities-col-score">
            {inputVisible ? (
              <input
                className={
                  "builder-abilities-input" +
                  (generationMethod == "" ? " builder-abilities-input-disabled" : "")
                }
                type="number"
                min={minScore}
                max={maxScore}
                value={displayBaseScore(Ability.con)}
                disabled={generationMethod == ""}
                onChange={(e) =>
                  props.updateCharData({
                    type: "set-ability-score",
                    ability: Ability.con,
                    value: +e.target.value,
                  })
                }
              ></input>
            ) : null}
            {dropdownVisible ? (
              <select
                className="builder-abilities-select"
                onChange={(e) => {
                  chooseNumber(JSON.parse(e.target.value), 2, Ability.con);
                }}
              >
                <option key="" value={0}></option>
                {numbersAvailableForIndex(2).map((n: PositionedNumber) => {
                  return (
                    <option key={n.position + " " + n.value} value={JSON.stringify(n)}>
                      {n.value}
                    </option>
                  );
                })}
              </select>
            ) : null}
          </div>
          <div className="builder-abilities-col builder-abilities-col-bonus">
            {displayBonus(Ability.con)}
          </div>
          <div className="builder-abilities-col builder-abilities-col-total">
            {displayTotal(Ability.con)}
          </div>
          <div className="builder-abilities-col builder-abilities-col-modifier">
            {displayModifier(Ability.con)}
          </div>
          {/*Intelligence*/}
          <div className="builder-abilities-col builder-abilities-col-attribute">Intelligence</div>
          <div className="builder-abilities-col builder-abilities-col-score">
            {inputVisible ? (
              <input
                className={
                  "builder-abilities-input" +
                  (generationMethod == "" ? " builder-abilities-input-disabled" : "")
                }
                type="number"
                min={minScore}
                max={maxScore}
                value={displayBaseScore(Ability.int)}
                disabled={generationMethod == ""}
                onChange={(e) =>
                  props.updateCharData({
                    type: "set-ability-score",
                    ability: Ability.int,
                    value: +e.target.value,
                  })
                }
              ></input>
            ) : null}
            {dropdownVisible ? (
              <select
                className="builder-abilities-select"
                onChange={(e) => {
                  chooseNumber(JSON.parse(e.target.value), 3, Ability.int);
                }}
              >
                <option key="" value={0}></option>
                {numbersAvailableForIndex(3).map((n: PositionedNumber) => {
                  return (
                    <option key={n.position + " " + n.value} value={JSON.stringify(n)}>
                      {n.value}
                    </option>
                  );
                })}
              </select>
            ) : null}
          </div>
          <div className="builder-abilities-col builder-abilities-col-bonus">
            {displayBonus(Ability.int)}
          </div>
          <div className="builder-abilities-col builder-abilities-col-total">
            {displayTotal(Ability.int)}
          </div>
          <div className="builder-abilities-col builder-abilities-col-modifier">
            {displayModifier(Ability.int)}
          </div>
          {/*Wisdom*/}
          <div className="builder-abilities-col builder-abilities-col-attribute">Wisdom</div>
          <div className="builder-abilities-col builder-abilities-col-score">
            {inputVisible ? (
              <input
                className={
                  "builder-abilities-input" +
                  (generationMethod == "" ? " builder-abilities-input-disabled" : "")
                }
                type="number"
                min={minScore}
                max={maxScore}
                value={displayBaseScore(Ability.wis)}
                disabled={generationMethod == ""}
                onChange={(e) =>
                  props.updateCharData({
                    type: "set-ability-score",
                    ability: Ability.wis,
                    value: +e.target.value,
                  })
                }
              ></input>
            ) : null}
            {dropdownVisible ? (
              <select
                className="builder-abilities-select"
                onChange={(e) => {
                  chooseNumber(JSON.parse(e.target.value), 4, Ability.wis);
                }}
              >
                <option key="" value={0}></option>
                {numbersAvailableForIndex(4).map((n: PositionedNumber) => {
                  return (
                    <option key={n.position + " " + n.value} value={JSON.stringify(n)}>
                      {n.value}
                    </option>
                  );
                })}
              </select>
            ) : null}
          </div>
          <div className="builder-abilities-col builder-abilities-col-bonus">
            {displayBonus(Ability.wis)}
          </div>
          <div className="builder-abilities-col builder-abilities-col-total">
            {displayTotal(Ability.wis)}
          </div>
          <div className="builder-abilities-col builder-abilities-col-modifier">
            {displayModifier(Ability.wis)}
          </div>
          {/*Charisma*/}
          <div className="builder-abilities-col builder-abilities-col-attribute">Charisma</div>
          <div className="builder-abilities-col builder-abilities-col-score">
            {inputVisible ? (
              <input
                className={
                  "builder-abilities-input" +
                  (generationMethod == "" ? " builder-abilities-input-disabled" : "")
                }
                type="number"
                min={minScore}
                max={maxScore}
                value={displayBaseScore(Ability.cha)}
                disabled={generationMethod == ""}
                onChange={(e) =>
                  props.updateCharData({
                    type: "set-ability-score",
                    ability: Ability.cha,
                    value: +e.target.value,
                  })
                }
              ></input>
            ) : null}
            {dropdownVisible ? (
              <select
                className="builder-abilities-select"
                onChange={(e) => {
                  chooseNumber(JSON.parse(e.target.value), 5, Ability.cha);
                }}
              >
                <option key="" value={0}></option>
                {numbersAvailableForIndex(5).map((n: PositionedNumber) => {
                  return (
                    <option key={n.position + " " + n.value} value={JSON.stringify(n)}>
                      {n.value}
                    </option>
                  );
                })}
              </select>
            ) : null}
          </div>
          <div className="builder-abilities-col builder-abilities-col-bonus">
            {displayBonus(Ability.cha)}
          </div>
          <div className="builder-abilities-col builder-abilities-col-total">
            {displayTotal(Ability.cha)}
          </div>
          <div className="builder-abilities-col builder-abilities-col-modifier">
            {displayModifier(Ability.cha)}
          </div>
        </div>
      </section>
    </div>
  );
}
