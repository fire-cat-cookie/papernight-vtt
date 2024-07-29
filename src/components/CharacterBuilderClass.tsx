import { CharDataSetter } from "../types/CharDataSetter";
import "./CharacterBuilder.scss";

export default function CharacterBuilderClass(props: CharDataSetter) {
  return (
    <div className="builder-tab-content" id="builder-class">
      <p>Class settings</p>
    </div>
  );
}
