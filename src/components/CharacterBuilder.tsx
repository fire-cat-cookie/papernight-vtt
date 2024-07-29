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
          src="../assets/avatar-placeholder.jpg"
          width="80"
          height="80"
        ></img>
        <div className="builder-group">
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

export function CharacterBuilderLineage(props: CharDataSetter) {
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

export function CharacterBuilderClass(props: CharDataSetter) {
  return (
    <div className="builder-tabcontent" id="builder-class">
      <p>Class settings</p>
    </div>
  );
}

export function CharacterBuilderAbilities(props: CharDataSetter) {
  return (
    <div className="builder-tabcontent" id="builder-abilities">
      <p>Ability settings</p>
    </div>
  );
}

export function CharacterBuilderBackground(props: CharDataSetter) {
  return (
    <div className="builder-tabcontent" id="builder-background">
      <p>Background settings</p>
    </div>
  );
}

export function CharacterBuilderEquipment(props: CharDataSetter) {
  return (
    <div className="builder-tabcontent" id="builder-equipment">
      <p>Equipment settings</p>
    </div>
  );
}
