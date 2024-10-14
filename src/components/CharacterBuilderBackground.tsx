import { CharDataAction } from "../operations/CharDataReducer";
import { CharData } from "../types/CharData";
import "./CharacterBuilder.scss";

type Props = {
  charData: CharData;
  updateCharData: React.Dispatch<CharDataAction>;
};

export default function CharacterBuilderBackground(props: Props) {
  return (
    <div className="builder-tab-content" id="builder-background">
      <p>Background settings</p>
    </div>
  );
}
