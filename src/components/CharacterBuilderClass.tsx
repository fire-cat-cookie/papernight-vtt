import { useEffect, useState } from "react";
import { CharDataAction } from "../operations/CharDataReducer";
import { getClasses } from "../operations/GetStaticData";
import { CharData } from "../types/CharData";
import { Class } from "../types/Class";
import "./CharacterBuilder.scss";
import "./CharacterBuilderClass.scss";
import { Feature } from "../types/Feature";

type Props = {
  charData: CharData;
  updateCharData: React.Dispatch<CharDataAction>;
};

export default function CharacterBuilderClass(props: Props) {
  let levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  let currentClasses = props.charData.classes.slice();
  let loadedClasses = getClasses();
  const [additionalClassEntryVisible, setAdditionalClassEntryVisible] = useState(false);
  const [selectedClassTab, setSelectedClassTab] = useState("");

  useEffect(() => {
    if (currentClasses.length == 1) setSelectedClassTab(currentClasses[0]?.name);
  }, [currentClasses]);

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
          {getRemainingLevels(charClass).map((level: number) => {
            return <option key={level}>{level}</option>;
          })}
        </select>
      </div>
    );
  }

  function getRemainingLevels(charClass: Class | undefined) {
    let subtractLevels = 0;
    for (let i = 0; i < currentClasses.length; i++) {
      if (currentClasses[i].name != charClass?.name) {
        subtractLevels += currentClasses[i]?.level ?? 0;
      }
    }
    if (subtractLevels >= 1) {
      return levels.slice(0, -1 * subtractLevels);
    } else {
      return levels;
    }
  }

  function getAvailableClasses(className: string) {
    let currentClassNames = currentClasses.map((c) => c.name);
    return loadedClasses.slice().filter((c) => {
      if (c.name == className) {
        return true;
      }
      if (currentClassNames.indexOf(c.name) != -1) {
        return false;
      }
      return true;
    });
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
            setAdditionalClassEntryVisible(false);
          }}
        >
          <option hidden disabled key="" value=""></option>
          {getAvailableClasses(charClass?.name ?? "").map((class_: any) => {
            return <option key={class_.name}>{class_.name}</option>;
          })}
        </select>
      </div>
    );
  }

  function renderAddMulticlass() {
    if (
      currentClasses.length > 0 &&
      getRemainingLevels(undefined).length > 0 &&
      !additionalClassEntryVisible
    ) {
      return (
        <section className="builder-section">
          <button
            className="builder-btn-multiclass"
            onClick={() => setAdditionalClassEntryVisible(true)}
          >
            Add Multiclass
          </button>
        </section>
      );
    } else {
      return null;
    }
  }

  function renderRemoveClassButton(charClass: Class | undefined, classIndex: number) {
    if (currentClasses.length > 1)
      return (
        <button
          className="builder-btn-remove-class"
          onClick={() => {
            props.updateCharData({ type: "remove-class", className: charClass?.name ?? "" });
          }}
        >
          Remove class
        </button>
      );
  }

  function renderClassSelectEntry(charClass: Class | undefined, classIndex: number) {
    return (
      <section className="builder-row" key={classIndex}>
        {renderClassSelect(charClass, classIndex)}
        {renderClassLevel(charClass)}
        {renderRemoveClassButton(charClass, classIndex)}
      </section>
    );
  }

  function displayFeatureDescription(description: string[]) {
    return (
      <div className="builder-section">
        <p>
          {description.map((line: string, index: number) => (
            <>
              {line}
              <br></br>
            </>
          ))}
        </p>
      </div>
    );
  }

  function renderClassFeatureList() {
    let selectedClass = currentClasses.find((c) => c.name == selectedClassTab);
    if (!selectedClass) {
      return null;
    }

    let featuresByLevel: Map<number, Feature[]> = new Map();
    for (let feature of selectedClass.features) {
      if (feature.level) {
        let featuresAtThisLevel = featuresByLevel.get(feature.level) ?? [];
        featuresAtThisLevel.push(feature);
        featuresByLevel.set(feature.level, featuresAtThisLevel);
      }
    }

    return (
      <div className="builder-sections">
        {Array.from(featuresByLevel.entries()).map((entry: any) => (
          <div key={selectedClass.name + entry[0]}>
            <h3>{"Level " + entry[0]}</h3>
            <br></br>
            <div className="builder-sections">
              {entry[1].map((feature: Feature) => (
                <div
                  className="builder-group"
                  key={selectedClass.name + entry[0] + " " + feature.name}
                >
                  <label>{feature.name}</label>
                  {displayFeatureDescription(feature.description)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  function renderClassFeatureTabRow() {
    return (
      <div className="builder-tab-row">
        {currentClasses.map((charClass: Class) => (
          <button
            key={charClass.name}
            className={
              selectedClassTab == charClass.name ? "builder-tab builder-tab-active" : "builder-tab"
            }
            onClick={() => {
              setSelectedClassTab(charClass.name);
            }}
          >
            {charClass.name}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="builder-tab-content builder-sections" id="builder-class">
      <div className="builder-sections">
        <h3>Class selection</h3>
        {currentClasses.length == 0 && renderClassSelectEntry(undefined, 0)}
        {currentClasses.map((charClass: Class, index: number) =>
          renderClassSelectEntry(charClass, index)
        )}
        {renderAddMulticlass()}
        {additionalClassEntryVisible && renderClassSelectEntry(undefined, currentClasses.length)}
      </div>
      <h3>Class features</h3>
      {renderClassFeatureTabRow()}
      {renderClassFeatureList()}
    </div>
  );
}
