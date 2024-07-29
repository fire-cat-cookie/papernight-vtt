import { CharDataSetter } from "../types/CharDataSetter";
import "./CharacterBuilder.scss";

export default function CharacterBuilderBackground(props: CharDataSetter) {
  return (
    <div className="builder-tab-content" id="builder-background">
      <p>Background settings</p>
    </div>
  );
}
