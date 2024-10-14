import { CharDataAction } from "../operations/CharDataReducer";
import { CharData } from "../types/CharData";
import "./CharacterBuilder.scss";

type Props = {
  charData: CharData;
  updateCharData: React.Dispatch<CharDataAction>;
};

export default function CharacterBuilderEquipment(props: Props) {
  return (
    <div className="builder-tab-content" id="builder-equipment">
      <p>Equipment settings</p>
    </div>
  );
}
