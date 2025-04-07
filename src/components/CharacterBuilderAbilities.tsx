import { useState } from "react";
import { CharDataAction } from "../operations/CharDataReducer";
import { Ability } from "../types/Ability";
import { CharComposed } from "../types/CharComposed";
import { CharData } from "../types/CharData";
import "./CharacterBuilder.scss";

type Props = {
  charData: CharData;
  charComposed: CharComposed;
  updateCharData: React.Dispatch<CharDataAction>;
};

export default function CharacterBuilderAbilities(props: Props) {
  let charData = props.charData;
  let charComposed = props.charComposed;
  const [generationMethod, setGenerationMethod] = useState("");

  function displayBonus(ability: Ability) {
    let baseScore = charData.base_ability_scores?.find((a) => a.ability == ability)?.score ?? 0;
    let totalScore = charComposed.abilities?.find((a) => a.ability == ability)?.score ?? 0;
    let result = totalScore - baseScore;
    return result >= 0 ? "+" + result : "" + result;
  }

  function displayModifier(ability: Ability) {
    let result = charComposed.abilities.find((a) => a.ability == ability)?.mod ?? 0;
    return result >= 0 ? "+" + result : "" + result;
  }

  function getBaseScore(ability: Ability) {
    return charData.base_ability_scores?.find((a) => a.ability == ability)?.score ?? 0;
  }

  function displayTotal(ability: Ability) {
    return charComposed.abilities?.find((a) => a.ability == ability)?.score ?? 0;
  }

  return (
    <div className="builder-tab-content" id="builder-abilities">
      <section className="builder-section">
        <div className="builder-group">
          <label htmlFor="generation-method">Generation Method:</label>
          <select
            name="generation-method"
            id="generation-method"
            value={generationMethod}
            onChange={(e) => {
              setGenerationMethod(e.target.value);
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
            <input
              className="builder-abilities-input"
              type="number"
              min="8"
              max="15"
              value={getBaseScore(Ability.str)}
              onChange={(e) =>
                props.updateCharData({
                  type: "set-ability-score",
                  ability: Ability.str,
                  value: +e.target.value,
                })
              }
            ></input>
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
            <input
              className="builder-abilities-input"
              type="number"
              min="8"
              max="15"
              value={getBaseScore(Ability.dex)}
              onChange={(e) =>
                props.updateCharData({
                  type: "set-ability-score",
                  ability: Ability.dex,
                  value: +e.target.value,
                })
              }
            ></input>
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
            <input
              className="builder-abilities-input"
              type="number"
              min="8"
              max="15"
              value={getBaseScore(Ability.con)}
              onChange={(e) =>
                props.updateCharData({
                  type: "set-ability-score",
                  ability: Ability.con,
                  value: +e.target.value,
                })
              }
            ></input>
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
            <input
              className="builder-abilities-input"
              type="number"
              min="8"
              max="15"
              value={getBaseScore(Ability.int)}
              onChange={(e) =>
                props.updateCharData({
                  type: "set-ability-score",
                  ability: Ability.int,
                  value: +e.target.value,
                })
              }
            ></input>
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
            <input
              className="builder-abilities-input"
              type="number"
              min="8"
              max="15"
              value={getBaseScore(Ability.wis)}
              onChange={(e) =>
                props.updateCharData({
                  type: "set-ability-score",
                  ability: Ability.wis,
                  value: +e.target.value,
                })
              }
            ></input>
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
            <input
              className="builder-abilities-input"
              type="number"
              min="8"
              max="15"
              value={getBaseScore(Ability.cha)}
              onChange={(e) =>
                props.updateCharData({
                  type: "set-ability-score",
                  ability: Ability.cha,
                  value: +e.target.value,
                })
              }
            ></input>
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
