import { CharDataAction } from "../operations/CharDataReducer";
import "./CharacterBuilder.scss";
import { CharData } from "../types/CharData";
import { getLineageData, getLineageNames } from "../operations/GetStaticData";
import { Target } from "../types/Bonus";

type Props = {
  charData: CharData;
  updateCharData: React.Dispatch<CharDataAction>;
};

export default function CharacterBuilderLineage(props: Props) {
  let lineageData: any = undefined;
  let sublineageData: any = undefined;
  if (props.charData.lineage) {
    lineageData = getLineageData(props.charData.lineage.name);
    if (props.charData.lineage.sublineage) {
      let sublineageName = props.charData.lineage.sublineage.name;
      sublineageData = lineageData?.sublineages?.find(
        (sublineage: any) => sublineage.name == sublineageName
      );
    }
  }

  function getFeatureDescription(feature: any) {
    let result = "";
    if (feature.description) {
      return feature.description;
    }
    if (feature.name == "Ability Scores") {
      for (let i = 0; i < feature.bonuses.length; i++) {
        if (i > 0) result += ", ";
        result +=
          "+" + feature.bonuses[i].flat + " " + targetAbilityScore(feature.bonuses[i].target);
      }
    } else if (feature.name == "Languages") {
      for (let i = 0; i < feature.languages.length; i++) {
        if (i > 0) result += ", ";
        result += feature.languages[i];
      }
    } else if (feature.name == "Darkvision") {
      result =
        "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can’t discern color in darkness, only shades of gray.";
    }
    return result;
  }

  function targetAbilityScore(target: Target) {
    switch (target) {
      case Target.str_score:
        return "Strength";
      case Target.dex_score:
        return "Dexterity";
      case Target.con_score:
        return "Constitution";
      case Target.int_score:
        return "Intelligence";
      case Target.wis_score:
        return "Wisdom";
      case Target.cha_score:
        return "Charisma";
    }
  }

  return (
    <div className="builder-tab-content" id="builder-lineage">
      <section className="builder-section">
        <div className="builder-group">
          <label htmlFor="lineage">Lineage:</label>
          <select
            name="lineage"
            id="lineage"
            value={lineageData ? lineageData.name : ""}
            onChange={(e) => {
              props.updateCharData({ type: "set-lineage", lineage: e.target.value });
            }}
          >
            <option key="" value=""></option>
            {getLineageNames().map((lineageName) => {
              return <option key={lineageName}>{lineageName}</option>;
            })}
          </select>
        </div>
      </section>
      {lineageData?.age ? (
        <section className="builder-section">
          <div className="builder-group">
            <label>Age:</label>
            <p>{lineageData?.age}</p>
          </div>
        </section>
      ) : null}
      {lineageData?.description ? (
        <section className="builder-section">
          <div className="builder-group">
            <label>Description:</label>
            <p>{lineageData?.description}</p>
          </div>
        </section>
      ) : null}
      {lineageData?.size ? (
        <section className="builder-section">
          <div className="builder-group">
            <label>Size:</label>
            <p>{lineageData?.size}</p>
          </div>
        </section>
      ) : null}
      {lineageData?.speed ? (
        <section className="builder-section">
          <div className="builder-group">
            <label>Speed:</label>
            <p>{lineageData?.speed + "ft"}</p>
          </div>
        </section>
      ) : null}
      {lineageData?.features?.map((feature: any) => {
        return (
          <section key={feature.name} className="builder-section">
            <div className="builder-group">
              <label>{feature.name}</label>
              <p>{getFeatureDescription(feature)}</p>
            </div>
          </section>
        );
      })}
      {/*Sublineage*/}
      {lineageData?.sublineages?.length > 0 ? (
        <div>
          <section className="builder-section">
            <div className="builder-group">
              <label htmlFor="sublineage">Sublineage:</label>
              <select
                name="sublineage"
                id="sublineage"
                defaultValue={sublineageData ? sublineageData.name : ""}
                onChange={(e) => {
                  props.updateCharData({ type: "set-sublineage", sublineage: e.target.value });
                }}
              >
                <option hidden disabled></option>
                {lineageData.sublineages.map((sublineage: any) => {
                  return <option key={sublineage.name}>{sublineage.name}</option>;
                })}
              </select>
            </div>
          </section>
          {sublineageData?.age ? (
            <section className="builder-section">
              <div className="builder-group">
                <label>Age:</label>
                <p>{lineageData?.age}</p>
              </div>
            </section>
          ) : null}
          {sublineageData?.description ? (
            <section className="builder-section">
              <div className="builder-group">
                <label>Description:</label>
                <p>{lineageData?.description}</p>
              </div>
            </section>
          ) : null}
          {sublineageData?.size ? (
            <section className="builder-section">
              <div className="builder-group">
                <label>Size:</label>
                <p>{lineageData?.size}</p>
              </div>
            </section>
          ) : null}
          {sublineageData?.features?.map((feature: any) => {
            return (
              <section key={feature.name} className="builder-section">
                <div className="builder-group">
                  <label>{feature.name}</label>
                  <p>{getFeatureDescription(feature)}</p>
                </div>
              </section>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
