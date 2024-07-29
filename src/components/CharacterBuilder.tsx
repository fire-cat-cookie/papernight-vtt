import { NavLink, Outlet } from "react-router-dom";
import "./CharacterBuilder.scss";
import { CharDataSetter } from "../types/CharDataSetter";

export default function CharacterBuilder(props: CharDataSetter) {
  return (
    <div id="builder">
      <h1>Character Builder</h1>
      <section className="builder-section" id="builder-section-top">
        <img
          className="builder-avatar"
          src="../content/avatar-placeholder.jpg"
          width="80"
          height="80"
        ></img>
        <div className="builder-group">
          <label>{"Character Name:"}</label>
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
