import { CharDataAction } from "../operations/CharDataReducer";
import { CharData } from "../types/CharData";
import "./CharacterBuilder.scss";

type Props = {
  charData: CharData;
  updateCharData: React.Dispatch<CharDataAction>;
};

export default function CharacterBuilderClass(props: Props) {
  return (
    <div className="builder-tab-content" id="builder-class">
      <section className="builder-section">
        <div className="builder-group">
          {/*
          <label htmlFor="class">Choose a class:</label>
          <select
            name="class"
            id="class"
            value={props.charData.classLevel}
            onChange={(e) => {
              props.updateCharData({ type: "set-lineage", lineage: e.target.value });
            }}
          >
            {getLineageNames().map((lineageName) => {
              return <option key={lineageName}>{lineageName}</option>;
            })}
          </select>
              */}
        </div>
      </section>
    </div>
  );
}
