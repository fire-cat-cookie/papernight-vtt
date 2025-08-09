import { useEffect, useState } from "react";
import { CharDataAction } from "../operations/CharDataReducer";
import { getClasses, getSubclass, getSubclasses } from "../operations/GetStaticData";
import { CharData } from "../types/CharData";
import { Class } from "../types/Class";
import "./CharacterBuilder.scss";
import "./CharacterBuilderClass.scss";
import { Feature } from "../types/Feature";
import React from "react";
import { GameUtil } from "../operations/GameUtil";
import CharacterBuilderClassASI from "./CharacterBuilderClassASI";
import { CharComposed } from "../types/CharComposed";
import { Util } from "../operations/Util";
import { Skill } from "../types/Skill";
import { FeatureUpgrade } from "../types/FeatureUpgrade";

type Props = {
  charData: CharData;
  charComposed: CharComposed;
  updateCharData: React.Dispatch<CharDataAction>;
};

export default function CharacterBuilderClass(props: Props) {
  let levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  let currentClasses = props.charData.classes.slice();
  let loadedClasses = getClasses();
  const [additionalClassEntryVisible, setAdditionalClassEntryVisible] = useState(false);
  const [selectedClassTab, setSelectedClassTab] = useState("");
  let selectedClass = currentClasses.find((c) => c.name == selectedClassTab);

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

  function renderRemoveClassButton(charClass: Class | undefined) {
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
        {renderRemoveClassButton(charClass)}
      </section>
    );
  }

  function renderClassHitDiceProficiencies() {
    if (!selectedClass) {
      return null;
    }

    let multiclass = currentClasses.length > 1 && currentClasses[0].name != selectedClass.name;
    let loadedClass: any = loadedClasses.find((c) => c.name == selectedClass.name);
    let armorProf = "";
    let weaponProf = "";
    let toolProf = "";
    let skillNumber = 0;
    let skillChoices: Skill[] = [];
    let skillsSelected: Skill[] = [];
    if (multiclass) {
      armorProf = loadedClass.armorProf?.multiclass?.join(", ") ?? "";
      weaponProf = loadedClass.weaponProf?.multiclass?.join(", ") ?? "";
      toolProf = loadedClass.toolProf?.multiclass?.join(", ") ?? "";
      skillNumber = loadedClass.skills?.multiclass?.number ?? 0;
      skillChoices = loadedClass.skills?.multiclass?.choices ?? [];
      skillsSelected = selectedClass.skills.multiclass ?? [];
    } else {
      armorProf = loadedClass.armorProf?.firstLevel?.join(", ") ?? "";
      weaponProf = loadedClass.weaponProf?.firstLevel?.join(", ") ?? "";
      toolProf = loadedClass.toolProf?.firstLevel?.join(", ") ?? "";
      skillNumber = loadedClass.skills?.firstLevel?.number ?? 0;
      skillChoices = loadedClass.skills?.firstLevel?.choices ?? [];
      skillsSelected = selectedClass.skills.firstLevel ?? [];
    }

    return (
      <div className="builder-class-hitdice-proficiencies">
        {<h3>{"Hit Dice & Proficiencies"} </h3>}
        {multiclass && (
          <div className="builder-group">
            <label>Multiclass</label>
            {<p className="builder-feature-text">{"Proficiencies are shown for multiclass"} </p>}
            {<p className="builder-feature-text">{"Multiclass requirement: "} </p>}
          </div>
        )}
        <div className="builder-group">
          <label>Hit dice</label>
          <p className="builder-feature-text">{"d" + selectedClass.hitDie}</p>
        </div>
        <div className="builder-group">
          <label>Saving Throws</label>
          <p className="builder-feature-text">{selectedClass.savingThrowProf.join(", ")}</p>
        </div>
        {armorProf != "" && (
          <div className="builder-group">
            <label>Armor</label>
            <p className="builder-feature-text">{armorProf}</p>
          </div>
        )}
        {weaponProf != "" && (
          <div className="builder-group">
            <label>Weapons</label>
            <p className="builder-feature-text">{weaponProf}</p>
          </div>
        )}
        {toolProf != "" && (
          <div className="builder-group">
            <label>Tools</label>
            <p className="builder-feature-text">{toolProf}</p>
          </div>
        )}
        {skillNumber > 0 && (
          <div className="builder-group">
            <label>Skills</label>
            <p className="builder-feature-text">
              {"Choose " + Util.NumberToWord(skillNumber) + ":"}
            </p>
            {renderclassSkillSelects(skillNumber, skillChoices, skillsSelected, multiclass)}
          </div>
        )}
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

  function renderClassFeatureList() {
    if (!selectedClass) {
      return null;
    }

    return (
      <div className="builder-sections">
        {Util.Sequence(1, 20).map((level) => renderClassFeatureLevelEntry(level))}
      </div>
    );
  }

  function renderClassFeatureLevelEntry(level: number) {
    if (!selectedClass) {
      return null;
    }

    let features = selectedClass.features.filter((f) => f.level == level) ?? [];
    let firstSubclassLevel = selectedClass.features.filter((f) => f.subclassFeature)[0].level;
    if (!selectedClass.subclass) {
      features = features.filter((f) => !f.subclassFeature || f.level == firstSubclassLevel);
    }
    let namedUpgrades = namedUpgradesAtLevel(level);

    if (features.length == 0 && namedUpgrades.length == 0) {
      return null;
    }

    return (
      <div key={selectedClass.name + level}>
        <h3 className="builder-heading-section">{"Level " + level}</h3>
        <br></br>
        {features.map((feature: Feature) => {
          return (
            <React.Fragment key={selectedClass.name + feature.level + " " + feature.name}>
              {(feature.level == firstSubclassLevel || !feature.subclassFeature) &&
                renderClassFeature(feature)}
              {feature.level == firstSubclassLevel && renderSubclassSelect()}
              {feature.subclassFeature && renderSubclassFeatures(feature.level)}
            </React.Fragment>
          );
        })}
        {namedUpgrades.map((upgrade: FeatureUpgrade) => {
          return (
            <React.Fragment
              key={selectedClass.name + upgrade.upgradeLevel + " " + upgrade.upgradeName}
            >
              {renderClassFeature(upgrade, upgrade.upgradeName)}
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  function renderClassFeature(feature: Feature, featureName?: string) {
    if (!selectedClass) {
      return null;
    }

    console.log(feature, featureName);

    return (
      <React.Fragment>
        <div className="builder-group">
          <label>{featureName ? featureName : feature.name}</label>
          {GameUtil.DisplayFeatureDescription(feature)}
        </div>
        {feature.abilityScoreImprovement && renderASIFeature(feature)}
      </React.Fragment>
    );
  }

  function renderASIFeature(feature: Feature) {
    return (
      <>
        {selectedClass && (
          <CharacterBuilderClassASI
            feature={feature}
            selectedClass={selectedClass}
            charComposed={props.charComposed}
            updateCharData={props.updateCharData}
          />
        )}
      </>
    );
  }

  function renderSubclassFeatures(level: number) {
    if (!selectedClass?.subclass) {
      return null;
    }
    let subclassFeatureTag = selectedClass.features.find((f) => f.subclassFeature)?.name;
    return (
      <>
        {selectedClass.subclass.features
          .filter((f) => f.level == level)
          .map((f) => renderClassFeature(f, "" + subclassFeatureTag + ": " + f.name))}
      </>
    );
  }

  function renderSubclassSelect() {
    if (!selectedClass) {
      return null;
    }

    let subclasses = getSubclasses(selectedClass.name);

    return (
      <div className="builder-group">
        <select
          key={selectedClass.name + " subclass select"}
          value={selectedClass.subclass?.name ?? ""}
          onChange={(e) =>
            props.updateCharData({
              type: "set-subclass",
              className: selectedClass.name,
              subclass: e.target.value,
            })
          }
        >
          <option hidden value=""></option>
          {subclasses.map((s: any) => (
            <option value={s.name} key={selectedClass.name + " " + s.name}>
              {s.name}
            </option>
          ))}
        </select>
      </div>
    );
  }

  function renderclassSkillSelects(
    skillNumber: number,
    skillChoices: Skill[],
    skillsSelected: Skill[],
    multiclass: boolean
  ) {
    if (!selectedClass) {
      return null;
    }

    return (
      <>
        {Array(skillNumber)
          .fill(1)
          .map((e, index) => (
            <select
              value={skillsSelected[index] ?? ""}
              key={
                selectedClass?.name +
                " Skill proficiencies " +
                index +
                (multiclass ? " multiclass" : "")
              }
              onChange={(e) => {
                let skill = Object.values(Skill).find((value) => value == e.target.value);
                if (skill) {
                  skillsSelected[index] = skill;
                }
                props.updateCharData({
                  type: "set-class-skills",
                  className: selectedClass.name,
                  skills: skillsSelected,
                });
              }}
            >
              <option value=""></option>
              {skillChoices
                .slice()
                .filter((s) => skillsSelected.indexOf(s) == -1 || s == skillsSelected[index])
                .map((s) => (
                  <option key={s}>{s}</option>
                ))}
            </select>
          ))}
      </>
    );
  }

  function renderClassTable() {
    if (!selectedClass) {
      return null;
    }

    let columnWidths: string[] = ["60px", "auto"];
    let progressionsShown: string[] = ["Level", "Features"];
    if (selectedClass.progression) {
      for (let prog of selectedClass.progression) {
        columnWidths.push("80px");
        progressionsShown.push(prog.name);
      }
    }

    let gridStyle = {
      gridTemplateColumns: columnWidths.join(" "),
    };

    return (
      <div className="builder-class-table" style={gridStyle}>
        {progressionsShown.map((prog) => (
          <div className="builder-class-table-col" key={selectedClass.name + " " + prog}>
            {prog}
          </div>
        ))}
        {levels.map((level) => {
          return (
            <React.Fragment key={selectedClass + " " + level}>
              {renderClassTableRow(progressionsShown, level)}
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  function namedUpgradesAtLevel(level: number) {
    return (
      selectedClass?.features
        .filter((f) => f.upgrades)
        .map((f) => f.upgrades)
        .flat()
        .filter((up) => up.upgradeLevel == level && up.upgradeName) ?? []
    );
  }

  function renderClassTableRow(progressions: string[], level: number) {
    if (!selectedClass) {
      return null;
    }

    let featuresAtLevel = selectedClass.features.filter((f) => f.level == level);
    let namedUpgrades = namedUpgradesAtLevel(level);
    let display = "";

    if (featuresAtLevel.length > 0) {
      display += featuresAtLevel?.map((f) => f.name).join(", ");
    }

    if (namedUpgrades.length > 0) {
      if (featuresAtLevel.length > 0) {
        display += ", ";
      }
      display += namedUpgrades?.map((up) => up.upgradeName).join(", ");
    }
    if (display == "") {
      display = "-";
    }

    return (
      <>
        <div className="builder-class-table-col">{level}</div>
        <div className="builder-class-table-col">{display}</div>
        {progressions.slice(2).map((prog) => (
          <div className="builder-class-table-col" key={selectedClass + " " + level + " " + prog}>
            {selectedClass.progression.find((p) => p.name == prog)?.entries[level - 1].display}
          </div>
        ))}
      </>
    );
  }

  return (
    <div className="builder-tab-content builder-sections" id="builder-class">
      <div className="builder-sections">
        <h3 className="builder-heading-section">Class selection</h3>
        {currentClasses.length == 0 && renderClassSelectEntry(undefined, 0)}
        {currentClasses.map((charClass: Class, index: number) =>
          renderClassSelectEntry(charClass, index)
        )}
        {renderAddMulticlass()}
        {additionalClassEntryVisible && renderClassSelectEntry(undefined, currentClasses.length)}
      </div>
      <div className="builder-sections">
        {renderClassFeatureTabRow()}
        {selectedClass && <h3 className="builder-heading-section">Progression</h3>}
        {renderClassTable()}
        {renderClassHitDiceProficiencies()}
      </div>
      {selectedClass && <h3 className="builder-heading-section">Features</h3>}
      {renderClassFeatureList()}
    </div>
  );
}
