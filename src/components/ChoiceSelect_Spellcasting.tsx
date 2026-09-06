import "./CharacterBuilder.scss";
import "./CharacterBuilderClass.scss";
import { Feature } from "../types/Feature";
import { CharDataAction } from "../operations/CharDataReducer";
import { Class } from "../types/Class";
import { CharData } from "../types/CharData";
import { GameUtil } from "../operations/GameUtil";
import { CharComposed } from "../types/CharComposed";
import ChoiceSelect from "./ChoiceSelect";
import SpellInfoHeader from "./SpellInfoHeader";
import { Spell } from "../types/Spell";
import { useEffect } from "react";

type Props = {
  feature: Feature;
  subclassFeature?: boolean;
  selectedClass: Class;
  charData: CharData;
  charComposed: CharComposed;
  updateCharData: React.Dispatch<CharDataAction>;
};

export function SpellNamesGrouped(options: Spell[]) {
  let spellsByLevel: Map<number, string[]> = new Map();
  for (let option of options ?? []) {
    let spellLevel = option.level;
    if (!spellsByLevel.has(spellLevel)) {
      spellsByLevel.set(spellLevel, []);
    }
    spellsByLevel.get(spellLevel)?.push(option.name);
  }
  const levelsAsText = [
    "Cantrips",
    "1st Level",
    "2nd Level",
    "3rd Level",
    "4th Level",
    "5th Level",
    "6th Level",
    "7th Level",
    "8th Level",
    "9th Level",
  ];
  let spellNamesGroupedArray: { group: string; values: string[] }[] = [];
  for (let i = 0; i < levelsAsText.length; i++) {
    let spellsAtThisLevel = spellsByLevel.get(i)?.sort() ?? [];
    if (spellsAtThisLevel.length > 0) {
      spellNamesGroupedArray.push({ group: levelsAsText[i], values: spellsByLevel.get(i) ?? [] });
    }
  }
  return spellNamesGroupedArray;
}

export default function ChoiceSelect_Spellcasting(props: Props) {
  let feature = props.feature;
  let selectedClass = props.selectedClass;
  let options: Spell[] = GameUtil.GetExpandedSpellList(selectedClass);
  if (feature.name == "Pact Magic") {
    options = options.filter((s) => s.level < 6);
  }
  let totalSpells = selectedClass.spellsKnown[selectedClass.level - 1];
  let totalCantrips = selectedClass.cantripsKnown[selectedClass.level - 1];
  let availableSpells =
    totalSpells - (feature?.spellcasting?.filter((s) => s.level > 0)?.length ?? 0);
  let availableCantrips =
    totalCantrips - (feature?.spellcasting?.filter((s) => s.level == 0)?.length ?? 0);

  //remove spells that are no longer on the options list
  useEffect(() => {
    for (let spell of feature.spellcasting ?? []) {
      if (options.find((o) => o.name == spell.name) == undefined) {
        OnOptionRemove(spell.name);
      }
    }
  }, [options]);

  function HeaderContent() {
    return (
      <>
        {totalCantrips > 0 && (
          <label>{"Cantrips available: " + availableCantrips + "/" + totalCantrips}</label>
        )}
        {totalSpells > 0 && (
          <label>{"Spells available: " + availableSpells + "/" + totalSpells}</label>
        )}
      </>
    );
  }

  function DetailsContent(option: string) {
    let selectedSpell = FindSpell(option);
    if (!selectedSpell) {
      return null;
    }
    return (
      <>
        {<h3>{option}</h3>}
        <SpellInfoHeader selectedSpell={selectedSpell}></SpellInfoHeader>
        {GameUtil.DisplayMarkdown(selectedSpell?.description ?? [])}
      </>
    );
  }

  function FindSpell(name: string) {
    return options.find((s) => s.name == name);
  }

  function IsOptionValid(option: string) {
    let selectedSpell = FindSpell(option);
    if (!selectedSpell) {
      return false;
    }
    if (IsOptionPicked(option)) {
      return false;
    }
    let requiredSpellLevel = true;
    let choicesRemaining = true;
    if (feature.name == "Pact Magic") {
      let spellSlotProgression = selectedClass.progression
        ?.find((p) => p.name == "Slot Level")
        ?.entries?.map((e) => e.value);
      let highestSpellSlot: number = spellSlotProgression?.[selectedClass.level - 1] ?? 0;
      let cantripsKnown: number = selectedClass.cantripsKnown?.[selectedClass.level - 1] ?? 0;
      let spellsKnown: number = selectedClass.spellsKnown?.[selectedClass.level - 1] ?? 0;
      let cantripsLearnt: number = feature.spellcasting?.filter((s) => s.level == 0)?.length ?? 0;
      let spellsLearnt: number = feature.spellcasting?.filter((s) => s.level > 0)?.length ?? 0;
      if (selectedSpell.level > highestSpellSlot) {
        requiredSpellLevel = false;
      }
      if (selectedSpell.level == 0 && cantripsKnown - cantripsLearnt < 1) {
        requiredSpellLevel = false;
      }
      if (selectedSpell.level > 0 && spellsKnown - spellsLearnt < 1) {
        choicesRemaining = false;
      }
    }
    return requiredSpellLevel == true && choicesRemaining == true;
  }

  function IsOptionPicked(option: string) {
    return feature.spellcasting?.find((s) => s.name == option) != undefined;
  }

  function OnOptionAdd(option: string) {
    let selectedSpell = FindSpell(option);
    if (!selectedSpell) {
      return;
    }
    props.updateCharData({
      type: "add-spell",
      spellName: selectedSpell.name,
      className: selectedClass.name,
      featureName: feature.name,
    });
  }

  function OnOptionRemove(option: string) {
    props.updateCharData({
      type: "remove-spell",
      spellName: option,
      className: selectedClass.name,
      featureName: feature.name,
    });
  }

  return (
    <ChoiceSelect
      contentHeight={"Large"}
      headerContent={HeaderContent()}
      optionNamesGrouped={SpellNamesGrouped(options)}
      optionIsPicked={IsOptionPicked}
      optionIsValid={IsOptionValid}
      detailsContent={DetailsContent}
      textAddOption={"Learn Spell"}
      textRemoveOption={"Remove Spell"}
      onOptionAdd={OnOptionAdd}
      onOptionRemove={OnOptionRemove}
    ></ChoiceSelect>
  );
}
