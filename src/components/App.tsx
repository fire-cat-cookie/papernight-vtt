import { useState } from 'react'
import './App.scss'
import CharacterSheet from './CharacterSheet'
import Header from './Header'
import { CreatureSize } from "../types/CreatureSize"
import { HitDice } from "../types/HitDice"

export default function App() {

  const [charData, setCharData] = useState({
    name: "Amalia",
    classLevel: "1 Warlock",
    lineage: "Tiefling (Winged)",
    initiative_adds: [],
    ac_adds: [{flat: 2, dice: "", name: "Armor"}],
    inspiration: false,
    hp: {
      current: 8,
      max: 8,
      temp: 0,
      max_adds: []
    },
    hitDice: [{
      type: 8,
      remaining: 1,
      total: 1
    }],
    conditions: ["Stunned", "Paralyzed"],
    speed: 30,
    speed_adds: [],
    creatureType: "Humanoid",
    size: CreatureSize.Medium,
    senses: ["Darkvision 60ft."],
    proficiency_bonus: 2,
    abilities: {
      str_score: 10,
      str_prof: false,
      str_score_adds: [],
      str_save_adds: [],
      dex_score: 12,
      dex_prof: false,
      dex_score_adds: [],
      dex_save_adds: [],
      con_score: 10,
      con_prof: false,
      con_score_adds: [],
      con_save_adds: [],
      int_score: 10,
      int_prof: false,
      int_score_adds: [],
      int_save_adds: [],
      wis_score: 10,
      wis_prof: false,
      wis_score_adds: [],
      wis_save_adds: [],
      cha_score: 10,
      cha_prof: false,
      cha_score_adds: [],
      cha_save_adds: []
    },
    skill_proficiency_multipliers: {
      acrobatics: 0,
      animal: 0,
      arcana: 0,
      athletics: 0,
      deception: 0,
      history: 0,
      insight: 0,
      intimidation: 0,
      investigation: 0,
      medicine: 0,
      nature: 0,
      perception: 0,
      performance: 0,
      persuasion: 0,
      religion: 0,
      sleight: 0,
      stealth: 0,
      survival: 0
    },
    skill_adds: {
      acrobatics: [],
      animal: [],
      arcana: [],
      athletics: [],
      deception: [],
      history: [],
      insight: [],
      intimidation: [],
      investigation: [],
      medicine: [],
      nature: [],
      perception: [],
      performance: [],
      persuasion: [],
      religion: [],
      sleight: [],
      stealth: [],
      survival: []
    },
    traits: [],
    inventory: [],
    languages: [],
    tool_prof: [],
    armor_weapon_prof: []
  })

  return (
    <>
      <Header title="Papernight VTT"/>
      <CharacterSheet charData={charData} setCharData={setCharData} />
    </>
  )
}