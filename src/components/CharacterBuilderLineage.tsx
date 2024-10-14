import { CharDataAction } from "../operations/CharDataReducer";
import "./CharacterBuilder.scss";
import { CharData } from "../types/CharData";
import { getLineageData, getLineageNames } from "../operations/GetLineageData";

type Props = {
  charData: CharData;
  updateCharData: React.Dispatch<CharDataAction>;
};

export default function CharacterBuilderLineage(props: Props) {
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
              props.updateCharData({ type: "set-lineage", lineage: e.target.value });
            }}
          >
            {getLineageNames().map((lineageName) => {
              return <option key={lineageName}>{lineageName}</option>;
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
