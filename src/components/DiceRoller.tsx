import { ReactElement, useState } from "react";
import "./DiceRoller.scss";
import { EffectTag } from "../types/EffectTag";
import { ConditionalEffect } from "../types/ConditionalEffect";
import { CharComposed } from "../types/CharComposed";

type Props = {
  initialDice: string;
  initialBonus: string;
  char: CharComposed;
  conditionalEffectsFilter: EffectTag[];
};

export default function DiceRoller(props: Props) {
  const [dice, setDice] = useState(props.initialDice);
  const [bonus, setBonus] = useState(props.initialBonus);
  const [advantage, setAdvantage] = useState(0);
  const [result, setResult] = useState("-");

  function parseRoll(dice: string, bonus: string, advantageState: number): string {
    let result = "";
    try {
      let diceTokens = dice.split("d");
      let numDice = parseInt(diceTokens[0].trim());
      let sides = parseInt(diceTokens[1].trim());
      let bonusNum = parseInt(bonus.replace("+", "").replace("-", "").trim());
      if (numDice < 0 || sides < 0 || bonusNum < 0) {
        throw new Error();
      }
      result = rollWithBonus(numDice, sides, bonusNum, advantageState).toString();
    } catch (error) {
      result = "Invalid input";
    }
    return result;
  }

  function rollWithBonus(
    numberOfDice: number,
    sides: number,
    bonus: number,
    advantageState: number
  ): number {
    let results = [];
    for (let i = 0; i <= Math.abs(advantageState); i++) {
      results.push(roll(numberOfDice, sides));
    }
    return (advantageState < 0 ? Math.min(...results) : Math.max(...results)) + bonus;
  }

  function roll(numberOfDice: number, sides: number): number {
    let result = 0;
    for (let i = 0; i < numberOfDice; i++) {
      result += Math.floor(Math.random() * sides + 1);
    }
    return result;
  }

  function toggleAdvantage(value: number) {
    switch (value) {
      case 1:
        return -1;
      case -1:
        return 0;
      case 0:
      default:
        return 1;
    }
  }

  function displayAdvantage(value: number) {
    switch (value) {
      case 1:
        return "A";
      case -1:
        return "D";
      case 0:
      default:
        return "-";
    }
  }

  function displayConditionalEffects() {
    let filteredEffects: ReactElement[] = [];
    props.char.features?.forEach((feature) => {
      filterConditionalEffects(feature.conditional_effects)?.forEach((effect) => {
        let info = "[" + feature.source + "] " + effect.info;
        filteredEffects.push(
          <div key={info} className="dice-roller-de-emphasize">
            {info}
          </div>
        );
      });
    });
    return filteredEffects;
  }

  function filterConditionalEffects(effects: ConditionalEffect[]) {
    return effects?.filter((effect) =>
      props.conditionalEffectsFilter.some((filterTag) => {
        return filterTag == effect.tag;
      })
    );
  }

  return (
    <div className="dice-roller">
      <section className="dice-roller-section">
        <div className="dice-roller-label-group">
          <input
            className="dice-roller-input-small"
            type="text"
            value={dice}
            onChange={(e) => setDice(e.target.value)}
          />
        </div>
        <div className="dice-roller-label-group">
          <input
            className="dice-roller-input-tiny"
            type="text"
            value={bonus}
            onChange={(e) => setBonus(e.target.value)}
          />
        </div>
        <div className="dice-roller-label-group">
          <button onClick={() => setAdvantage(toggleAdvantage(advantage))}>
            {displayAdvantage(advantage)}
          </button>
        </div>
      </section>
      {displayConditionalEffects()}
      <br />
      <section className="dice-roller-section">
        <button onClick={() => setResult(parseRoll(dice, bonus, advantage))}>Roll</button>
        Result: {result}
      </section>
    </div>
  );
}
