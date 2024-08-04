import { CharDataSetter } from "../types/CharDataSetter";
import "./CharacterBuilder.scss";
import { lineagesJson } from "../index";
import { CreatureSize } from "../types/CreatureSize";
import { CharData } from "../types/CharData";

export default function CharacterBuilderLineage(props: CharDataSetter) {
  function selectLineage(lineage: string) {
    let charData = props.charData;
    let lineageData = getLineageData(lineage);
    charData.lineage = lineageData.name;
    charData = setSize(lineageData, charData);
    charData = setAbilityScoreBonuses(lineageData, charData);
    props.setCharData({ ...props.charData });
  }

  function getLineageData(lineageName: string): any {
    return (
      lineagesJson.find((lineage) => {
        return lineage.name == lineageName;
      }) ?? {}
    );
  }

  function setSize(lineageData: any, charData: CharData): CharData {
    let size = lineageData.size;
    if (!size) {
      charData.size = CreatureSize.Error;
    }
    charData.size = size;
    return charData;
  }

  function setAbilityScoreBonuses(lineageData: any, charData: CharData): CharData {
    let lineageAbilities = lineageData.ability_scores;
    clearLineageAbilityScores(charData);
    if (!lineageAbilities) {
      return charData;
    }
    let charDataAbilities = props.charData.abilities;
    let charDataScoreAddsMap = new Map([
      ["Strength", charDataAbilities.str.score_adds],
      ["Dexterity", charDataAbilities.dex.score_adds],
      ["Constitution", charDataAbilities.con.score_adds],
      ["Intelligence", charDataAbilities.int.score_adds],
      ["Wisdom", charDataAbilities.wis.score_adds],
      ["Charisma", charDataAbilities.cha.score_adds],
    ]);
    lineageAbilities.forEach((ability: any) => {
      let charDataScoreAdds = charDataScoreAddsMap.get(ability.score);
      charDataScoreAdds?.push({
        flat: ability.bonus,
        dice: "",
        name: "Lineage",
      });
    });
    charData.abilities = charDataAbilities;
    return charData;
  }

  function clearLineageAbilityScores(charData: CharData): CharData {
    let abilities = charData.abilities;
    let abilityDataArray = [
      abilities.str,
      abilities.dex,
      abilities.con,
      abilities.int,
      abilities.wis,
      abilities.cha,
    ];
    abilityDataArray.forEach((ability) => {
      ability.score_adds = ability.score_adds.filter((scoreBonus) => {
        scoreBonus.name != "Lineage";
      });
    });
    return charData;
  }

  function displayAbilityScores(): string {
    let abilities: any[] = getLineageData(props.charData.lineage)?.ability_scores;
    if (!abilities) {
      return "No data";
    }
    let result = "";
    for (let i = 0; i < abilities.length; i++) {
      if (i > 0) result += ", ";
      result += "+" + abilities[i].bonus + " " + abilities[i].score;
    }
    return result;
  }

  return (
    <div className="builder-tab-content" id="builder-lineage">
      <section className="builder-section">
        <div className="builder-group">
          <label htmlFor="lineage">Choose a lineage:</label>
          <select
            name="lineage"
            id="lineage"
            value={props.charData.lineage}
            onChange={(e) => {
              selectLineage(e.target.value);
            }}
          >
            {lineagesJson.map((lineage) => {
              return <option key={lineage.name}>{lineage.name}</option>;
            })}
          </select>
        </div>
      </section>
      <section className="builder-section">
        <div className="builder-group">
          <label>Description:</label>
          <p>{getLineageData(props.charData.lineage)?.description}</p>
        </div>
      </section>
      <section className="builder-section">
        <div className="builder-group">
          <label>Size:</label>
          <p>{getLineageData(props.charData.lineage)?.size}</p>
        </div>
      </section>
      <section className="builder-section">
        <div className="builder-group">
          <label>Ability Scores:</label>
          <p>{displayAbilityScores()}</p>
        </div>
      </section>
    </div>
  );
}
