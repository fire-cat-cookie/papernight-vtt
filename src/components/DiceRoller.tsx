import { useState } from "react";
import "./DiceRoller.scss";
import { CharData } from "../types/CharData";
import { Util } from "../operations/Util";
import { EffectTag } from "../types/EffectTag";
import { ConditionalEffect } from "../types/ConditionalEffect";

type Props = {
  initialDice: string;
  initialBonus: string;
  charData: CharData;
  conditionalEffectsFilter: EffectTag[];
};

export default function DiceRoller(props: Props) {
  const [dice, setDice] = useState(props.initialDice);
  const [bonus, setBonus] = useState(props.initialBonus);
  const [advantage1, setAdvantage1] = useState(0);
  const [advantage2, setAdvantage2] = useState(0);
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
    let filteredEffects: ConditionalEffect[] = [];
    props.charData.features?.forEach((feature) => {
      filterConditionalEffects(feature.conditional_effects)?.forEach((effect) =>
        filteredEffects.push(effect)
      );
    });

    return <>{filteredEffects.map((effect) => effect.info)}</>;
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
      <section>
        <input type="text" value={dice} onChange={(e) => setDice(e.target.value)} />
        <input type="text" value={bonus} onChange={(e) => setBonus(e.target.value)} />
        <button onClick={() => setAdvantage1(toggleAdvantage(advantage1))}>
          {displayAdvantage(advantage1)}
        </button>
        <button onClick={() => setAdvantage2(toggleAdvantage(advantage2))}>
          {displayAdvantage(advantage2)}
        </button>
        <button onClick={() => setResult(parseRoll(dice, bonus, advantage1 + advantage2))}>
          Roll
        </button>
      </section>
      <br />
      Conditional Bonuses:
      <div className="dice-roller-conditions-list">{displayConditionalEffects()}</div>
      <section>
        <p>Result: {result}</p>
      </section>
    </div>
  );
}
