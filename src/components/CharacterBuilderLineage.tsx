import { CharDataAction } from "../operations/CharDataReducer";
import "./CharacterBuilder.scss";
import { CharData } from "../types/CharData";
import { getLineageData, getLineageNames } from "../operations/GetStaticData";
import { GameUtil } from "../operations/GameUtil";

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
        (sublineage: any) => sublineage.name == sublineageName,
      );
    }
  }

  function renderLineageSelect() {
    return (
      <section className="builder-content-row">
        <div className="builder-content-col">
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
      <section className="builder-content-row">
        <div className="builder-content-col">
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
      <section className="builder-content-row">
        <div className="builder-content-col">
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
            <section key={feature.name} className="builder-content-row">
              <div className="builder-content-col">
                <label>{feature.name}</label>
                <p>{GameUtil.GetFeatureDescription(feature)}</p>
              </div>
            </section>
          );
        })}
      </>
    );
  }

  function renderSublineageSection() {
    return (
      <div className="builder-content-col">
        {renderSublineageSelect()}
        {renderLabelledSection(sublineageData?.age, "Age:", sublineageData?.age)}
        {renderLabelledSection(
          sublineageData?.description,
          "Description:",
          sublineageData?.description,
        )}
        {renderLabelledSection(sublineageData?.size, "Size:", sublineageData?.size)}
        {renderLabelledSection(sublineageData?.speed, "Speed:", sublineageData?.speed + "ft")}
        {renderFeatures(sublineageData?.features)}
      </div>
    );
  }

  return (
    <div className="builder-content-main " id="builder-lineage">
      <div className="builder-content-col">
        {/*Lineage*/}
        {renderLineageSelect()}
        {renderLabelledSection(lineageData?.age, "Age:", lineageData?.age)}
        {renderLabelledSection(lineageData?.description, "Description:", lineageData?.description)}
        {renderLabelledSection(lineageData?.size, "Size:", lineageData?.size)}
        {renderLabelledSection(lineageData?.speed, "Speed:", lineageData?.speed + "ft")}
        {renderFeatures(lineageData?.features)}
      </div>
      {/*Sublineage*/}
      {lineageData?.sublineages?.length > 0 && renderSublineageSection()}
    </div>
  );
}
