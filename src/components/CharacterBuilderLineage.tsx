import { CharDataAction } from "../operations/CharDataReducer";
import "./CharacterBuilder.scss";
import { CharData } from "../types/CharData";
import { getLineageData, getLineageNames } from "../operations/GetLineageData";

type Props = {
  charData: CharData;
  updateCharData: React.Dispatch<CharDataAction>;
};

export default function CharacterBuilderLineage(props: Props) {
  let lineageData = getLineageData(props.charData.lineage);

  function displayAbilityScores(): string {
    let abilities: any[] = lineageData?.ability_scores;
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
          <label>Age:</label>
          <p>{lineageData?.age}</p>
        </div>
      </section>
      <section className="builder-section">
        <div className="builder-group">
          <label>Description:</label>
          <p>{lineageData?.description}</p>
        </div>
      </section>
      <section className="builder-section">
        <div className="builder-group">
          <label>Size:</label>
          <p>{lineageData?.size}</p>
        </div>
      </section>
      <section className="builder-section">
        <div className="builder-group">
          <label>Languages:</label>
          <p>{lineageData?.languages.join(", ")}</p>
        </div>
      </section>
      <section className="builder-section">
        <div className="builder-group">
          <label>Ability Scores:</label>
          <p>{displayAbilityScores()}</p>
        </div>
      </section>
      <section className="builder-section">
        <div className="builder-group">
          <label>Speed:</label>
          <p>{lineageData?.speed + "ft"}</p>
        </div>
      </section>
      {lineageData?.features?.map((feature: any) => {
        return (
          <section key={feature.name} className="builder-section">
            <div className="builder-group">
              <label>{feature.name}</label>
              <p>{feature.description}</p>
            </div>
          </section>
        );
      })}
    </div>
  );
}
