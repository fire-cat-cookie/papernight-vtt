import { CharDataAction } from "../operations/CharDataReducer";
import { CharData } from "../types/CharData";
import "./CharacterBuilder.scss";

type Props = {
  charData: CharData;
  updateCharData: React.Dispatch<CharDataAction>;
};

export default function CharacterBuilderAbilities(props: Props) {
  return (
    <div className="builder-tab-content" id="builder-abilities">
      <p>Ability settings</p>
    </div>
  );
}
