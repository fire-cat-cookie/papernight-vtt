//lineages
import halfling from "../content/lineage/Halfling.json";
import tiefling from "../content/lineage/Tiefling.json";
//classes
import barbarian from "../content/class/Barbarian.json";
import warlock from "../content/class/Warlock.json";
//subclasses
//barbarian
import berserker from "../content/subclass/Barbarian/Berserker.json";
//warlock
import fiend from "../content/subclass/Warlock/Fiend.json";
//spells
import spells from "../content/spells.json";
//options
import eldritch_invocations from "../content/eldritch invocations.json";

export const lineagesJson = [halfling, tiefling];
export const classesJson = [barbarian, warlock];
export const subclassesJson = [berserker, fiend];
export const spellsJson = spells;
export const featureTablesJson = [eldritch_invocations];
