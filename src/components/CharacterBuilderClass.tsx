import { CharDataAction } from "../operations/CharDataReducer";
import { getClasses } from "../operations/GetStaticData";
import { CharData } from "../types/CharData";
import { Class } from "../types/Class";
import "./CharacterBuilder.scss";
import "./CharacterBuilderClass.scss";

type Props = {
  charData: CharData;
  updateCharData: React.Dispatch<CharDataAction>;
};

export default function CharacterBuilderClass(props: Props) {
  let levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  let currentClasses = props.charData.classes.slice();
  let loadedClasses = getClasses();

  function renderClassLevel(charClass: Class | undefined) {
    return (
      <div className="builder-group">
        <label>Level:</label>
        <select
          className="builder-class-level"
          value={charClass?.level ?? 1}
          disabled={!charClass}
          onChange={(e) => {
            if (charClass) {
              props.updateCharData({
                type: "set-class-level",
                className: charClass?.name,
                level: +e.target.value,
              });
            }
          }}
        >
          {levels.map((level: number) => {
            return <option key={level}>{level}</option>;
          })}
        </select>
      </div>
    );
  }

  function renderClassSelect(charClass: Class | undefined, classIndex: number) {
    return (
      <div className="builder-group">
        <label htmlFor="class">Class:</label>
        <select
          className="builder-class-select"
          value={charClass?.name ?? ""}
          onChange={(e) => {
            if (currentClasses[classIndex]) {
              props.updateCharData({
                type: "remove-class",
                className: charClass?.name ?? "",
              });
            }
            props.updateCharData({
              type: "set-class-level",
              className: e.target.value,
              level: currentClasses[classIndex] ? currentClasses[classIndex].level : 1,
            });
          }}
        >
          <option hidden disabled key="" value=""></option>
          {loadedClasses.map((class_: any) => {
            return <option key={class_.name}>{class_.name}</option>;
          })}
        </select>
      </div>
    );
  }

  function renderClassSelectEntry(charClass: Class | undefined, classIndex: number) {
    return (
      <section className="builder-row" key={classIndex}>
        {renderClassSelect(charClass, classIndex)}
        {renderClassLevel(charClass)}
      </section>
    );
  }

  return (
    <div className="builder-tab-content builder-sections" id="builder-class">
      <>
        {currentClasses.length == 0 && renderClassSelectEntry(undefined, 0)}
        {currentClasses.map((charClass: Class, index: number) =>
          renderClassSelectEntry(charClass, index)
        )}
      </>
    </div>
  );
}
