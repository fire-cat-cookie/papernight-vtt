import { CharDataSetter } from "../types/CharDataSetter";
import "./CharacterBuilder.scss";
import { lineagesJson } from "../index";

export default function CharacterBuilderLineage(props: CharDataSetter) {
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
              props.setCharData({ ...props.charData, lineage: e.target.value });
            }}
          >
            {lineagesJson.map((lineage) => {
              console.log(lineage);
              return <option key={lineage.name}>{lineage.name}</option>;
            })}
          </select>
        </div>
      </section>
      <section className="builder-section">
        <div className="builder-group">
          <label>Description:</label>
          <p>
            {
              lineagesJson.find((lineage) => {
                return lineage.name == props.charData.lineage;
              })?.description
            }
          </p>
        </div>
      </section>
      <section className="builder-section">
        <div className="builder-group">
          <label>Size:</label>
          <p>
            {
              lineagesJson.find((lineage) => {
                return lineage.name == props.charData.lineage;
              })?.size
            }
          </p>
        </div>
      </section>
    </div>
  );
}
