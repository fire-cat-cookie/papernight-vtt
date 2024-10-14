import { lineagesJson } from "../index";

export function getLineageData(lineageName: string): any {
  return (
    lineagesJson.find((lineage) => {
      return lineage.name == lineageName;
    }) ?? {}
  );
}

export function getLineageNames() {
  return lineagesJson.map((lineage) => lineage.name);
}
