import { lineagesJson, spellsJson, classesJson, subclassesJson, featureTablesJson } from "../index";

export function getLineageData(lineageName: string): any {
  return lineagesJson.find((lineage) => lineage.name == lineageName) ?? {};
}

export function getLineageNames() {
  return lineagesJson.map((lineage) => lineage.name);
}

export function getSpells() {
  return spellsJson;
}

export function getClasses() {
  return classesJson;
}

export function getClass(className: string): any {
  return classesJson.find((class_: any) => class_.name == className) ?? {};
}

export function getSubclasses(className: string): any {
  return subclassesJson.filter((s) => s.baseClass == className);
}

export function getSubclass(className: string, subclassName: string): any {
  return getSubclasses(className).find((sub: any) => sub.name == subclassName);
}

export function getFeatureOptions(tableName: string): any {
  return featureTablesJson.find((ft) => ft.name == tableName)?.options;
}

export function getFeatureOption(tableName: string, featureName: string): any {
  return getFeatureOptions(tableName).find((f: any) => f.name == featureName);
}
