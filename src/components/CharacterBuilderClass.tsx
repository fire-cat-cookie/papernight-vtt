import { useEffect, useState } from "react";
import { CharDataAction } from "../operations/CharDataReducer";
import {
  getClasses,
  getSubclasses,
  getFeatureOptions,
  getSpells,
  getClassSpells,
} from "../operations/GetStaticData";
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
import { Spell } from "../types/Spell";

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
  let loadedClasses = getClasses();
  const [additionalClassEntryVisible, setAdditionalClassEntryVisible] = useState(false);
  const [selectedClassTab, setSelectedClassTab] = useState(currentClasses[0]?.name ?? "");
  const [selectedSectionTab, setSelectedSectionTab] = useState(SectionTabs.ClassOverview);
  const [selectedSpellName, setSelectedSpellName] = useState("");
  let selectedClass = currentClasses.find((c) => c.name == selectedClassTab);
  let spellOptions: any[] = getClassSpells(selectedClass?.name ?? "");
  let selectedSpell: any = spellOptions?.find((s) => s.name == selectedSpellName);
  let charComposed = props.charComposed;
  let spellcastingFeature = selectedClass?.features.find((f) => f.spellcastingFeature);
  if (selectedSectionTab == SectionTabs.Spells && !spellcastingFeature) {
    setSelectedSectionTab(SectionTabs.ClassOverview);
  }
  if (!spellOptions.indexOf(selectedSpellName)) {
    setSelectedSpellName("");
  }

  useEffect(() => {
    if (currentClasses.length == 1) setSelectedClassTab(currentClasses[0]?.name);
  }, [currentClasses]);

  function renderClassLevel(charClass: Class | undefined) {
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

  function renderClassSelect(charClass: Class | undefined, classIndex: number) {
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

  function renderAddMulticlass() {
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

  function renderRemoveClassButton(charClass: Class | undefined) {
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

  function renderClassSelectEntry(charClass: Class | undefined, classIndex: number) {
    return (
      <section className="builder-content-row" key={classIndex}>
        {renderClassSelect(charClass, classIndex)}
        {renderClassLevel(charClass)}
        {renderRemoveClassButton(charClass)}
      </section>
    );
  }

  function renderClassTable() {
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
      <div className="builder-class-table" style={gridStyle}>
        {headers.map((prog) => (
          <div className="builder-class-table-col" key={selectedClass.name + " " + prog}>
            {prog}
          </div>
        ))}
        {levels.map((level) => {
          return (
            <React.Fragment key={selectedClass + " " + level}>
              {renderClassTableRow(level)}
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

  function renderClassTableRow(level: number) {
    if (!selectedClass) {
      return null;
    }

    let featuresAtLevel = selectedClass.features.filter((f) => f.level == level);
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
            {renderclassSkillSelects(skillNumber, skillChoices, skillsSelected, multiclass)}
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

  function renderClassTabRow() {
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
              {SectionTabs.Spells}
            </a>
          )}
        </div>
      </div>
    );
  }

  function renderClassFeatureList() {
    if (!selectedClass) {
      return null;
    }

    return (
      <div className="builder-content-col">
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
      <div
        className="builder-content-col builder-content-section-1"
        key={selectedClass.name + level}
      >
        <h3>{"Level " + level}</h3>
        {level == 1 && renderClassHitDiceProficiencies()}
        {features.map((feature: Feature) => {
          return (
            <React.Fragment key={selectedClass.name + feature.level + " " + feature.name}>
              {renderClassFeature(feature, firstSubclassLevel)}
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

  function renderClassFeature(feature: Feature, firstSubclassLevel: number) {
    return (
      <div>
        <Collapsible
          heading={feature.name}
          className={"builder-header-collapsible"}
          content={
            <React.Fragment>
              {
                //show description for base class features
                (!feature.subclassFeature || feature.level == firstSubclassLevel) &&
                  GameUtil.DisplayFeatureDescription(feature, false)
              }
              {feature.choices && renderChoiceSelects(feature)}
              {feature.level == firstSubclassLevel &&
                feature.subclassFeature &&
                renderSubclassSelect()}
              {feature.choices && renderFeatureChoiceDescriptions(feature.choices.selected)}
              {feature.abilityScoreImprovement && renderASIFeature(feature)}
            </React.Fragment>
          }
        ></Collapsible>
        {feature.subclassFeature && renderSubclassFeatures(feature.level)}
      </div>
    );
  }

  function renderSpellSelect() {
    if (!selectedClass) {
      return null;
    }

    let totalSpells = selectedClass.spellsKnown[selectedClass.level - 1];
    let totalCantrips = selectedClass.cantripsKnown[selectedClass.level - 1];
    let availableSpells = totalSpells - (selectedClass.spells?.length ?? 0);
    let availableCantrips = totalCantrips - (selectedClass.cantrips?.length ?? 0);

    return (
      <React.Fragment>
        <div className="builder-content-col">
          {totalCantrips > 0 && (
            <label>{"Cantrips available: " + availableCantrips + "/" + totalCantrips}</label>
          )}
          {totalSpells > 0 && (
            <label>{"Spells available: " + availableSpells + "/" + totalSpells}</label>
          )}
        </div>
        <div className="builder-multiselect">
          <div className="builder-multiselect-pane-list">
            {spellOptions.map((s) => (
              <React.Fragment key={s.name}>
                <div className="builder-multiselect-pane-list-item">
                  <div
                    className={selectedSpellName == s.name ? "active" : ""}
                    onClick={() => setSelectedSpellName(s.name)}
                  >
                    {s.name}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
          <div className="builder-multiselect-pane-details">
            {selectedSpell && <h3>{selectedSpell.name}</h3>}
            <div className="builder-content-col">
              {!selectedSpell && <p>Select a spell to view its details.</p>}
              {GameUtil.DisplayMarkdown(selectedSpell?.description ?? [])}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  function renderFeatureChoiceDescriptions(features: Feature[]) {
    return features
      ?.filter((f) => f != undefined)
      .map((f) => (
        <React.Fragment key={f.name}>
          <div className="builder-content-col">
            <label>{f.name}</label>
            {GameUtil.DisplayFeatureDescription(f, false)}
          </div>
        </React.Fragment>
      ));
  }

  function renderChoiceSelects(feature: Feature) {
    if (!selectedClass) {
      return null;
    }

    if (feature.choices.variableNumber) {
      feature.choices.number =
        charComposed.features.find((f) => f.feature.name == feature.name)?.feature.choices.number ??
        0;
    }

    return (
      <div className="builder-content-col">
        {Array(feature.choices.number)
          .fill(1)
          .map((_, index) => renderChoiceSelect(feature, index))}
      </div>
    );
  }

  function renderChoiceSelect(feature: Feature, index: number) {
    if (!selectedClass) {
      return null;
    }

    if (feature.choices.selected == undefined) {
      feature.choices.selected = Array(feature.choices.number).fill(undefined);
    }

    if (feature.choices.optionsSource) {
      feature.choices.options = getFeatureOptions(feature.choices.optionsSource);
    }

    let selectedChoice = feature.choices.selected[index];

    return (
      <React.Fragment
        key={selectedClass.name + " " + feature.level + feature.name + " choice select" + index}
      >
        <select
          value={selectedChoice?.name ?? ""}
          onChange={(e) => {
            let selectedFeature = feature.choices.options.find((f) => f.name == e.target.value);
            if (selectedFeature) {
              feature.choices.selected[index] = selectedFeature;
            }
            props.updateCharData({
              type: "update-class-feature",
              className: selectedClass.name,
              feature: feature,
            });
          }}
        >
          <option hidden value=""></option>
          {feature.choices.options
            .slice()
            .filter(
              (option) =>
                feature.choices.selected.find((selected) => selected?.name == option.name) ==
                  undefined || option.name == feature.choices.selected[index]?.name,
            )
            .map((option) => (
              <option key={option.name}>{option.name}</option>
            ))}
        </select>
        {selectedChoice?.requirements && renderRequirements(selectedChoice)}
      </React.Fragment>
    );
  }

  function renderRequirements(feature: Feature) {
    return (
      <div className="builder-content-col">
        <label>{"Requirements"}</label>
        {feature?.requirements?.map((r) =>
          GameUtil.CheckRequirement(charComposed, r) ? (
            <label key={r.type + ": " + r.value}>
              &#9745;{" " + GameUtil.DisplayRequirement(r)}
            </label>
          ) : (
            <label key={r.type + ": " + r.value} className={"text-warning"}>
              &#9744;{" " + GameUtil.DisplayRequirement(r)}
            </label>
          ),
        )}
      </div>
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
          .map((f) => (
            <React.Fragment key={selectedClass.name + f.level + subclassFeatureTag + " " + f.name}>
              <Collapsible
                heading={"" + subclassFeatureTag + ": " + f.name}
                className={"builder-header-collapsible"}
                content={GameUtil.DisplayFeatureDescription(f, false)}
              ></Collapsible>
            </React.Fragment>
          ))}
      </>
    );
  }

  function renderSubclassSelect() {
    if (!selectedClass) {
      return null;
    }

    let subclasses = getSubclasses(selectedClass.name);

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

  function renderclassSkillSelects(
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

  function renderClassOverview() {
    return <div className="builder-content-section-1">{renderClassTable()}</div>;
  }

  return (
    <div className="builder-content-main" id="builder-class">
      <div className="builder-content-col">
        {currentClasses.length == 0 && renderClassSelectEntry(undefined, 0)}
        {currentClasses.map((charClass: Class, index: number) =>
          renderClassSelectEntry(charClass, index),
        )}
        {renderAddMulticlass()}
        {additionalClassEntryVisible && renderClassSelectEntry(undefined, currentClasses.length)}
      </div>
      {selectedClass && renderClassTabRow()}
      {selectedSectionTab == SectionTabs.ClassOverview && renderClassOverview()}
      {selectedSectionTab == SectionTabs.ClassFeatures && renderClassFeatureList()}
      {selectedSectionTab == SectionTabs.Spells && spellcastingFeature && (
        <div className="builder-content-section-1">{renderSpellSelect()}</div>
      )}
    </div>
  );
}
