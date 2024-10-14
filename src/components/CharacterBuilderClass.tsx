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
      <p>Class settings</p>
    </div>
  );
}
