import { CharDataSetter } from "../types/CharDataSetter";
import "./CharacterBuilder.scss";

export default function CharacterBuilderLineage(props: CharDataSetter) {
  return (
    <div className="builder-tabcontent" id="builder-lineage">
      <section className="builder-section">
        <div className="builder-group">
          <label htmlFor="lineage">Choose a lineage:</label>
          <br />
          <select name="lineage" id="lineage">
            <option value="halfling">Halfling</option>
            <option value="tiefling">Tiefling</option>
          </select>
        </div>
      </section>
    </div>
  );
}
