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
  let sublineageData = lineageData?.sublineages?.find(
    (sublineage: any) => sublineage.name == props.charData.sublineage
  );

  function displayAbilityScores(abilities: any[]): string {
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
      {lineageData?.age ? (
        <section className="builder-section">
          <div className="builder-group">
            <label>Age:</label>
            <p>{lineageData?.age}</p>
          </div>
        </section>
      ) : null}
      {lineageData?.description ? (
        <section className="builder-section">
          <div className="builder-group">
            <label>Description:</label>
            <p>{lineageData?.description}</p>
          </div>
        </section>
      ) : null}
      <section className="builder-section">
        <div className="builder-group">
          <label>Size:</label>
          <p>{lineageData?.size}</p>
        </div>
      </section>
      {lineageData?.languages ? (
        <section className="builder-section">
          <div className="builder-group">
            <label>Languages:</label>
            <p>{lineageData?.languages.join(", ")}</p>
          </div>
        </section>
      ) : null}
      {lineageData?.ability_scores ? (
        <section className="builder-section">
          <div className="builder-group">
            <label>Ability Scores:</label>
            <p>{displayAbilityScores(lineageData?.ability_scores)}</p>
          </div>
        </section>
      ) : null}
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
      {/*Sublineage*/}
      {lineageData?.sublineages?.length > 0 ? (
        <>
          <section className="builder-section">
            <div className="builder-group">
              <label htmlFor="sublineage">Sublineage:</label>
              <select
                name="sublineage"
                id="sublineage"
                defaultValue={props.charData.sublineage}
                onChange={(e) => {
                  props.updateCharData({ type: "set-sublineage", sublineage: e.target.value });
                }}
              >
                <option hidden disabled></option>
                {lineageData.sublineages.map((sublineage: any) => {
                  return <option key={sublineage.name}>{sublineage.name}</option>;
                })}
              </select>
            </div>
          </section>
          {sublineageData?.age ? (
            <section className="builder-section">
              <div className="builder-group">
                <label>Age:</label>
                <p>{lineageData?.age}</p>
              </div>
            </section>
          ) : null}
          {sublineageData?.description ? (
            <section className="builder-section">
              <div className="builder-group">
                <label>Description:</label>
                <p>{lineageData?.description}</p>
              </div>
            </section>
          ) : null}
          {sublineageData?.size ? (
            <section className="builder-section">
              <div className="builder-group">
                <label>Size:</label>
                <p>{lineageData?.size}</p>
              </div>
            </section>
          ) : null}
          {sublineageData?.languages ? (
            <section className="builder-section">
              <div className="builder-group">
                <label>Languages:</label>
                <p>{lineageData?.languages.join(", ")}</p>
              </div>
            </section>
          ) : null}
          {sublineageData?.ability_scores ? (
            <section className="builder-section">
              <div className="builder-group">
                <label>Ability Scores:</label>
                <p>{displayAbilityScores(sublineageData.ability_scores)}</p>
              </div>
            </section>
          ) : null}
          {sublineageData?.speed ? (
            <section className="builder-section">
              <div className="builder-group">
                <label>Speed:</label>
                <p>{lineageData?.speed + "ft"}</p>
              </div>
            </section>
          ) : null}
          {sublineageData?.features?.map((feature: any) => {
            return (
              <section key={feature.name} className="builder-section">
                <div className="builder-group">
                  <label>{feature.name}</label>
                  <p>{feature.description}</p>
                </div>
              </section>
            );
          })}
        </>
      ) : null}
    </div>
  );
}
