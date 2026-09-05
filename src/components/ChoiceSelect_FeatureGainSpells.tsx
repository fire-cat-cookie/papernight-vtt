import "./CharacterBuilder.scss";
import "./CharacterBuilderClass.scss";
import { Feature } from "../types/Feature";
import { CharDataAction } from "../operations/CharDataReducer";
import { Class } from "../types/Class";
import * as GetStaticData from "../operations/GetStaticData";
import * as ComposeChar from "../operations/ComposeChar";
import { CharData } from "../types/CharData";
import { GameUtil } from "../operations/GameUtil";
import { CharComposed } from "../types/CharComposed";
import ChoiceSelect from "./ChoiceSelect";
import SpellInfoHeader from "./SpellInfoHeader";
import { SpellNamesGrouped } from "./ChoiceSelect_Spellcasting";

type Props = {
  feature: Feature;
  subclassFeature?: boolean;
  selectedClass: Class;
  charData: CharData;
  charComposed: CharComposed;
  updateCharData: React.Dispatch<CharDataAction>;
};

export default function ChoiceSelect_FeatureGainSpells(props: Props) {
  let feature = props.feature;
  let spellList = feature.gainSpells?.spellList;
  let options = GetStaticData.getSpellList(spellList?.spellNames ?? []);

  if (spellList?.source) {
    options = GetStaticData.getClassSpells(props.selectedClass.name);
    if (spellList.spellLevel != undefined) {
      options = options.filter((s) => s.level == spellList.spellLevel);
    }
    if (spellList.spellSchool != undefined) {
      options = options.filter((s) => s.school == spellList.spellSchool);
    }
  }

  let choicesNumber = feature.gainSpells?.number ?? 0;
  if (feature.gainSpells?.variableNumber) {
    choicesNumber = ComposeChar.evaluateFormula(
      props.charData,
      props.selectedClass.name,
      feature.gainSpells?.variableNumber,
    );
  }

  let choicesRemaining = choicesNumber - (feature.gainSpells?.selected?.length ?? 0);

  function HeaderContent() {
    return (
      <>
        {choicesNumber > 0 && (
          <label>{"Choices available: " + choicesRemaining + "/" + choicesNumber}</label>
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
        {selectedSpell && <h3>{selectedSpell.name}</h3>}
        {<SpellInfoHeader selectedSpell={selectedSpell}></SpellInfoHeader>}
        {GameUtil.DisplayMarkdown(selectedSpell?.description ?? [])}
      </>
    );
  }

  function FindSpell(name: string) {
    return options.find((s) => s.name == name);
  }

  function IsOptionPicked(option: string) {
    return feature.gainSpells?.selected?.find((s) => s.name == option) != undefined;
  }

  function IsOptionValid(option: string) {
    let valid = true;
    if (IsOptionPicked(option) || choicesRemaining < 1) {
      return false;
    }
    return valid;
  }

  function OnOptionAdd(option: string) {
    props.updateCharData({
      type: props.subclassFeature ? "update-subclass-feature" : "update-class-feature",
      feature: {
        ...feature,
        gainSpells: {
          ...feature.gainSpells,
          selected: [...(feature.gainSpells?.selected ?? []), { name: option }],
        },
      },
      className: props.selectedClass.name,
    });
  }

  function OnOptionRemove(option: string) {
    props.updateCharData({
      type: props.subclassFeature ? "update-subclass-feature" : "update-class-feature",
      feature: {
        ...feature,
        gainSpells: {
          ...feature.gainSpells,
          selected: feature.gainSpells?.selected?.filter((s) => s.name != option) ?? [],
        },
      },
      className: props.selectedClass.name,
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
