import { useState } from "react";
import "./DiceRoller.scss";

type Props = {
  initialDice: string;
  initialBonus: string;
};

export default function DiceRoller({ initialDice, initialBonus }: Props) {
  const [dice, setDice] = useState(initialDice);
  const [bonus, setBonus] = useState(initialBonus);
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

  return (
    <div className="dice-roller">
      <div>
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
      </div>
      <div>
        <p>Result: {result}</p>
      </div>
    </div>
  );
}
