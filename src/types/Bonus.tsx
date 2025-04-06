export enum Target {
  initiative = "initiative",
  ac = "ac",
  hp = "hp",
  speed = "speed",
  str_score = "str_score",
  str_save = "str_save",
  con_score = "con_score",
  con_save = "con_save",
  dex_score = "dex_score",
  dex_save = "dex_save",
  int_score = "int_score",
  int_save = "int_save",
  wis_score = "wis_score",
  wis_save = "wis_save",
  cha_score = "cha_score",
  cha_save = "cha_save",
  acrobatics = "acrobatics",
  animal_handling = "animal_handling",
  arcana = "arcana",
  athletics = "athletics",
  deception = "deception",
  history = "history",
  insight = "insight",
  intimidation = "intimidation",
  investigation = "investigation",
  medicine = "medicine",
  nature = "nature",
  perception = "perception",
  performance = "performance",
  persuasion = "persuasion",
  religion = "religion",
  sleight_of_hand = "sleight_of_hand",
  stealth = "stealth",
  survival = "survival",
}

export interface Bonus {
  name: string;
  source: string;
  target: Target;
  flat: number;
}
