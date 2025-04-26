import { CharDataAction } from "../operations/CharDataReducer";
import "./CharacterBuilder.scss";
import { CharData } from "../types/CharData";
import { getLineageData, getLineageNames } from "../operations/GetStaticData";
import { Util } from "../operations/Util";

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
          "+" + feature.bonuses[i].flat + " " + Util.TargetAbilityScore(feature.bonuses[i].target);
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

  function renderLineageSelect() {
    return (
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
            <option hidden disabled key="" value=""></option>
            {getLineageNames().map((lineageName) => {
              return <option key={lineageName}>{lineageName}</option>;
            })}
          </select>
        </div>
      </section>
    );
  }

  function renderSublineageSelect() {
    return (
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
    );
  }

  function renderLabelledSection(condition: boolean, label: string, description: string) {
    if (!condition) {
      return null;
    }
    return (
      <section className="builder-section">
        <div className="builder-group">
          <label>{label}</label>
          <p>{description}</p>
        </div>
      </section>
    );
  }

  function renderFeatures(featureList: any[]) {
    if (!featureList) {
      return null;
    }
    return (
      <>
        {featureList.map((feature: any) => {
          return (
            <section key={feature.name} className="builder-section">
              <div className="builder-group">
                <label>{feature.name}</label>
                <p>{getFeatureDescription(feature)}</p>
              </div>
            </section>
          );
        })}
      </>
    );
  }

  return (
    <div className="builder-tab-content" id="builder-lineage">
      {/*Lineage*/}
      {renderLineageSelect()}
      {renderLabelledSection(lineageData?.age, "Age:", lineageData?.age)}
      {renderLabelledSection(lineageData?.description, "Description:", lineageData?.description)}
      {renderLabelledSection(lineageData?.size, "Size:", lineageData?.size)}
      {renderLabelledSection(lineageData?.speed, "Speed:", lineageData?.speed + "ft")}
      {renderFeatures(lineageData?.features)}
      {/*Sublineage*/}
      {lineageData?.sublineages?.length > 0 ? (
        <div>
          {renderSublineageSelect()}
          {renderLabelledSection(sublineageData?.age, "Age:", sublineageData?.age)}
          {renderLabelledSection(
            sublineageData?.description,
            "Description:",
            sublineageData?.description
          )}
          {renderLabelledSection(sublineageData?.size, "Size:", sublineageData?.size)}
          {renderLabelledSection(sublineageData?.speed, "Speed:", sublineageData?.speed + "ft")}
          {renderFeatures(sublineageData?.features)}
        </div>
      ) : null}
    </div>
  );
}
