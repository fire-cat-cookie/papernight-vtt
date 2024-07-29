import { NavLink, Outlet } from "react-router-dom";
import "./CharacterBuilder.scss";
import { CharData } from "../types/CharData";

type Props = {
  charData: CharData;
  setCharData: React.Dispatch<React.SetStateAction<CharData>>;
};

export default function CharacterBuilder(props: Props) {
  return (
    <div id="builder">
      <h1>Character Builder</h1>
      <section id="builder-section-top">
        <img
          className="builder-avatar"
          src="../assets/avatar-placeholder.jpg"
          width="80"
          height="80"
        ></img>
        <div>
          <label>{"Character Name:"}</label> <br />
          <input
            type="text"
            id="builder-input-nametag"
            value={props.charData.name}
            onChange={(e) => {
              props.setCharData({ ...props.charData, name: e.target.value });
            }}
          ></input>
        </div>
      </section>
      <div id="builder-tabs">
        <NavLink to="/builder/lineage">Lineage</NavLink>
        <NavLink to="/builder/class">Class</NavLink>
        <NavLink to="/builder/abilities">Abilities</NavLink>
        <NavLink to="/builder/background">Background</NavLink>
        <NavLink to="/builder/equipment">Equipment</NavLink>
      </div>
      <div id="builder-main">
        <Outlet />
      </div>
    </div>
  );
}

export function CharacterBuilderLineage(props: Props) {
  return (
    <div id="builder-lineage">
      <p>Lineage settings</p>
    </div>
  );
}

export function CharacterBuilderClass(props: Props) {
  return (
    <div id="builder-class">
      <p>Class settings</p>
    </div>
  );
}

export function CharacterBuilderAbilities(props: Props) {
  return (
    <div id="builder-abilities">
      <p>Ability settings</p>
    </div>
  );
}

export function CharacterBuilderBackground(props: Props) {
  return (
    <div id="builder-background">
      <p>Background settings</p>
    </div>
  );
}

export function CharacterBuilderEquipment(props: Props) {
  return (
    <div id="builder-equipment">
      <p>Equipment settings</p>
    </div>
  );
}
