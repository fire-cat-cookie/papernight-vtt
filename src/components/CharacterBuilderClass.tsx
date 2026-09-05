import { useEffect, useState } from "react";
import { CharDataAction } from "../operations/CharDataReducer";
import * as GetStaticData from "../operations/GetStaticData";
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
import Collapsible from "./Collapsible";
import SpellSelect from "./SpellSelect";
import ChoiceSelect_Spellcasting from "./ChoiceSelect_Spellcasting";
import ChoiceSelectGeneric from "./ChoiceSelect";
import * as ComposeChar from "../operations/ComposeChar";
import ChoiceSelect_FeatureOptions from "./ChoiceSelect_FeatureOptions";
import ChoiceSelect_FeatureGainSpells from "./ChoiceSelect_FeatureGainSpells";

type Props = {
  charData: CharData;
  charComposed: CharComposed;
  updateCharData: React.Dispatch<CharDataAction>;
};

enum SectionTabs {
  ClassOverview = "Class Overview",
  ClassFeatures = "Class Features",
  Spells = "Spells",
}

export default function CharacterBuilderClass(props: Props) {
  let levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  let currentClasses = props.charData.classes.slice();
  let loadedClasses = GetStaticData.getClasses();

  const [additionalClassEntryVisible, setAdditionalClassEntryVisible] = useState(false);
  const [selectedClassTab, setSelectedClassTab] = useState(currentClasses[0]?.name ?? "");
  const [selectedSectionTab, setSelectedSectionTab] = useState(SectionTabs.ClassOverview);

  let selectedClass = currentClasses.find((c) => c.name == selectedClassTab);
  let spellcastingFeature = selectedClass?.features?.find((f) => f.spellcastingFeature);
  if (selectedSectionTab == SectionTabs.Spells && !spellcastingFeature) {
    setSelectedSectionTab(SectionTabs.ClassOverview);
  }

  useEffect(() => {
    if (currentClasses.length == 1) setSelectedClassTab(currentClasses[0]?.name);
  }, [currentClasses]);

  function SelectClassLevel(charClass: Class | undefined) {
    return (
      <div className="builder-content-col">
        <label>Level</label>
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

  function getAvailableClasses(selectedClass: string) {
    let currentClassNames = currentClasses.map((c) => c.name);
    return loadedClasses.slice().filter((c) => {
      if (c.name == selectedClass) {
        return true;
      }
      if (currentClassNames.indexOf(c.name) != -1) {
        return false;
      }
      return true;
    });
  }

  function SelectClass(charClass: Class | undefined, classIndex: number) {
    return (
      <div className="builder-content-col">
        <label htmlFor="class">{classIndex == 0 ? "Primary class" : "Multiclass"}</label>
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

  function AddMulticlass() {
    if (
      currentClasses.length > 0 &&
      getRemainingLevels(undefined).length > 0 &&
      getAvailableClasses("").length > 0 &&
      !additionalClassEntryVisible
    ) {
      return (
        <section className="builder-content-row">
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

  function RemoveClass(charClass: Class | undefined) {
    return (
      <div className="builder-content-col">
        <button
          className="builder-btn-remove-class"
          disabled={currentClasses.length <= 1}
          onClick={() => {
            props.updateCharData({ type: "remove-class", className: charClass?.name ?? "" });
          }}
        >
          Remove class
        </button>
      </div>
    );
  }

  function SelectClassRow(charClass: Class | undefined, classIndex: number) {
    return (
      <section className="builder-content-row" key={classIndex}>
        {SelectClass(charClass, classIndex)}
        {SelectClassLevel(charClass)}
        {RemoveClass(charClass)}
      </section>
    );
  }

  function ProgressionTable() {
    if (!selectedClass) {
      return null;
    }

    let columnWidths: string[] = ["60px", "auto"];
    let headers: string[] = ["Level", "Features"];

    if (selectedClass.cantripsKnown?.length > 0) {
      columnWidths.push("80px");
      headers.push("Cantrips Known");
    }
    if (selectedClass.spellsKnown?.length > 0) {
      columnWidths.push("80px");
      headers.push("Spells Known");
    }
    if (selectedClass.progression) {
      for (let prog of selectedClass.progression) {
        columnWidths.push("80px");
        headers.push(prog.name);
      }
    }

    let gridStyle = {
      gridTemplateColumns: columnWidths.join(" "),
    };

    return (
      <div className="builder-table" style={gridStyle}>
        {headers.map((prog) => (
          <div key={selectedClass.name + " " + prog}>{prog}</div>
        ))}
        {levels.map((level) => {
          return (
            <React.Fragment key={selectedClass + " " + level}>
              {ProgressionTableRow(level)}
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

  function ProgressionTableRow(level: number) {
    if (!selectedClass) {
      return null;
    }

    let featuresAtLevel = selectedClass.features?.filter((f) => f.level == level);
    let namedUpgrades = namedUpgradesAtLevel(level);
    let featuresDisplay = "";

    if (featuresAtLevel.length > 0) {
      featuresDisplay += featuresAtLevel?.map((f) => f.name).join(", ");
    }

    if (namedUpgrades.length > 0) {
      if (featuresAtLevel.length > 0) {
        featuresDisplay += ", ";
      }
      featuresDisplay += namedUpgrades?.map((up) => up.upgradeName).join(", ");
    }
    if (featuresDisplay == "") {
      featuresDisplay = "-";
    }

    return (
      <>
        <div className="builder-class-table-col">{level}</div>
        <div className="builder-class-table-col">{featuresDisplay}</div>
        {selectedClass.cantripsKnown?.length > 0 && (
          <div
            className="builder-class-table-col"
            key={selectedClass + " " + level + " cantrips known"}
          >
            {selectedClass.cantripsKnown[level - 1]}
          </div>
        )}
        {selectedClass.spellsKnown?.length > 0 && (
          <div
            className="builder-class-table-col"
            key={selectedClass + " " + level + " spells known"}
          >
            {selectedClass.spellsKnown[level - 1]}
          </div>
        )}
        {selectedClass.progression.map((prog) => (
          <div
            className="builder-class-table-col"
            key={selectedClass + " " + level + " " + prog.name}
          >
            {prog.entries[level - 1].display}
          </div>
        ))}
      </>
    );
  }

  function HitDiceProficiencies() {
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
    let content = (
      <div>
        {multiclass && (
          <div className="builder-content-col">
            <label>Multiclass</label>
            {<p>{"Multiclass requirement: "} </p>}
          </div>
        )}
        <div className="builder-content-col">
          <label>Hit dice</label>
          <p>{"d" + selectedClass.hitDie}</p>
        </div>
        <div className="builder-content-col">
          <label>Saving Throws</label>
          <p>{selectedClass.savingThrowProf.join(", ")}</p>
        </div>
        {armorProf != "" && (
          <div className="builder-content-col">
            <label>Armor</label>
            <p>{armorProf}</p>
          </div>
        )}
        {weaponProf != "" && (
          <div className="builder-content-col">
            <label>Weapons</label>
            <p>{weaponProf}</p>
          </div>
        )}
        {toolProf != "" && (
          <div className="builder-content-col">
            <label>Tools</label>
            <p>{toolProf}</p>
          </div>
        )}
        {skillNumber > 0 && (
          <div className="builder-content-col">
            <label>Skills</label>
            <p>{"Choose " + Util.NumberToWord(skillNumber) + ":"}</p>
            {SkillChoices(skillNumber, skillChoices, skillsSelected, multiclass)}
          </div>
        )}
      </div>
    );
    return (
      <div className="builder-class-hitdice-proficiencies">
        {
          <Collapsible
            heading={"Hit Dice & Proficiencies"}
            className={"builder-header-collapsible"}
            content={content}
          ></Collapsible>
        }
      </div>
    );
  }

  function ClassNavMenu() {
    return (
      <div className="builder-tab-row-nested">
        <div className="builder-tab-row">
          {currentClasses.map((charClass: Class) => (
            <a
              key={charClass.name}
              className={
                selectedClassTab == charClass.name
                  ? "builder-tab builder-tab-active"
                  : "builder-tab"
              }
              onClick={() => {
                setSelectedClassTab(charClass.name);
              }}
            >
              {charClass.name}
            </a>
          ))}
        </div>
        <div className="builder-tab-row">
          <a
            className={
              selectedSectionTab == SectionTabs.ClassOverview
                ? "builder-tab builder-tab-active"
                : "builder-tab"
            }
            onClick={() => {
              setSelectedSectionTab(SectionTabs.ClassOverview);
            }}
          >
            {SectionTabs.ClassOverview}
          </a>
          <a
            className={
              selectedSectionTab == SectionTabs.ClassFeatures
                ? "builder-tab builder-tab-active"
                : "builder-tab"
            }
            onClick={() => {
              setSelectedSectionTab(SectionTabs.ClassFeatures);
            }}
          >
            {SectionTabs.ClassFeatures}
          </a>
          {spellcastingFeature && (
            <a
              className={
                selectedSectionTab == SectionTabs.Spells
                  ? "builder-tab builder-tab-active"
                  : "builder-tab"
              }
              onClick={() => {
                setSelectedSectionTab(SectionTabs.Spells);
              }}
            >
              {spellcastingFeature.name}
            </a>
          )}
        </div>
      </div>
    );
  }

  function ClassFeatures() {
    if (!selectedClass) {
      return null;
    }

    return (
      <div className="builder-content-col">
        {Util.Sequence(1, 20).map((level) => ClassFeatureLevelEntry(level))}
      </div>
    );
  }

  function ClassFeatureLevelEntry(level: number) {
    if (!selectedClass) {
      return null;
    }

    let features = selectedClass.features.filter((f) => f.level == level) ?? [];
    let firstSubclassLevel = selectedClass.features.filter((f) => f.gainSubclassFeature)[0].level;
    if (!selectedClass.subclass) {
      features = features.filter((f) => !f.gainSubclassFeature || f.level == firstSubclassLevel);
    }
    let namedUpgrades = namedUpgradesAtLevel(level);

    if (features.length == 0 && namedUpgrades.length == 0) {
      return null;
    }

    return (
      <div className="builder-content-section-1" key={selectedClass.name + level}>
        <h3>{"Level " + level}</h3>
        {level == 1 && HitDiceProficiencies()}
        {features.map((feature: Feature) => {
          return (
            <React.Fragment key={selectedClass.name + feature.level + " " + feature.name}>
              {ClassFeature(feature, firstSubclassLevel)}
            </React.Fragment>
          );
        })}
        {namedUpgrades.map((upgrade: FeatureUpgrade) => {
          return (
            <React.Fragment
              key={selectedClass.name + upgrade.upgradeLevel + " " + upgrade.upgradeName}
            >
              <Collapsible
                heading={upgrade.upgradeName}
                className={"builder-header-collapsible"}
                content={GameUtil.DisplayFeatureDescription(upgrade, false)}
              ></Collapsible>
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  function ClassFeature(
    feature: Feature,
    firstSubclassLevel: number,
    heading?: string,
    subclassFeature?: boolean,
  ) {
    return (
      <div>
        <Collapsible
          heading={heading ? heading : feature.name}
          className={"builder-header-collapsible"}
          content={
            <React.Fragment>
              {
                //show description, unless it is a base feature that simply provides subclass features
                (!feature.gainSubclassFeature || feature.level == firstSubclassLevel) &&
                  GameUtil.DisplayFeatureDescription(feature, false)
              }
              {feature.choices && ClassFeatureChoices(feature, subclassFeature)}
              {feature.gainSpells &&
                !feature.gainSpells.fixed &&
                ClassFeatureGainSpells(feature, subclassFeature)}
              {feature.level == firstSubclassLevel &&
                feature.gainSubclassFeature &&
                SelectSubclass()}
              {feature.abilityScoreImprovement && ClassFeatureASI(feature)}
            </React.Fragment>
          }
        ></Collapsible>
        {feature.gainSubclassFeature && SubclassFeatures(feature.level)}
      </div>
    );
  }

  function ClassFeatureChoices(feature: Feature, subclassFeature?: boolean) {
    if (!selectedClass) {
      return null;
    }
    return (
      <ChoiceSelect_FeatureOptions
        feature={feature}
        subclassFeature={subclassFeature}
        selectedClass={selectedClass}
        charData={props.charData}
        charComposed={props.charComposed}
        updateCharData={props.updateCharData}
      ></ChoiceSelect_FeatureOptions>
    );
  }

  function ClassFeatureGainSpells(feature: Feature, subclassFeature?: boolean) {
    if (!selectedClass) {
      return null;
    }
    return (
      <ChoiceSelect_FeatureGainSpells
        selectedClass={selectedClass}
        subclassFeature={subclassFeature}
        updateCharData={props.updateCharData}
        feature={feature}
        charData={props.charData}
        charComposed={props.charComposed}
      ></ChoiceSelect_FeatureGainSpells>
    );
  }

  function ClassFeatureASI(feature: Feature) {
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

  function SubclassFeatures(level: number) {
    if (!selectedClass?.subclass) {
      return null;
    }
    let subclassFeatureTag = selectedClass.features.find((f) => f.gainSubclassFeature)?.name;
    return (
      <>
        {selectedClass.subclass.features
          .filter((f) => f.level == level)
          .map((f) => (
            <React.Fragment key={selectedClass.name + f.level + subclassFeatureTag + " " + f.name}>
              {ClassFeature(f, 0, "" + subclassFeatureTag + ": " + f.name)}
            </React.Fragment>
          ))}
      </>
    );
  }

  function SelectSubclass() {
    if (!selectedClass) {
      return null;
    }

    let subclasses = GetStaticData.getSubclasses(selectedClass.name);

    return (
      <div className="builder-content-col">
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

  function SkillChoices(
    skillNumber: number,
    skillChoices: Skill[],
    skillsSelected: Skill[],
    multiclass: boolean,
  ) {
    if (!selectedClass) {
      return null;
    }

    return (
      <>
        {Array(skillNumber)
          .fill(1)
          .map((_, index) => (
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

  function ClassOverview() {
    return <div className="builder-content-section-1">{ProgressionTable()}</div>;
  }

  return (
    <div className="builder-content-main" id="builder-class">
      <div className="builder-content-col">
        {currentClasses.length == 0 && SelectClassRow(undefined, 0)}
        {currentClasses.map((charClass: Class, index: number) => SelectClassRow(charClass, index))}
        {AddMulticlass()}
        {additionalClassEntryVisible && SelectClassRow(undefined, currentClasses.length)}
      </div>
      {selectedClass && ClassNavMenu()}
      {selectedSectionTab == SectionTabs.ClassOverview && ClassOverview()}
      {selectedSectionTab == SectionTabs.ClassFeatures && ClassFeatures()}
      {selectedSectionTab == SectionTabs.Spells && selectedClass && spellcastingFeature && (
        <div className="builder-content-section-1">
          {
            <ChoiceSelect_Spellcasting
              feature={spellcastingFeature}
              selectedClass={selectedClass}
              charData={props.charData}
              charComposed={props.charComposed}
              updateCharData={props.updateCharData}
            ></ChoiceSelect_Spellcasting>
          }
        </div>
      )}
    </div>
  );
}
