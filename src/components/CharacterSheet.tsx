import { useState } from 'react'
import DiceRoller from './DiceRoller'
import './CharacterSheet.scss'
import { CreatureSize } from "../types/CreatureSize"
import { Bonus } from "../types/Bonus"
import { HitDice } from '../types/HitDice';


export default function CharacterSheet(props: any){

  const [diceRollerVisible, setDiceRollerVisible] = useState(false)
  const [nextRoll, setNextRoll] = useState({dice: "1d20", bonus: "+0"})
  const [diceRollerPosition, setDiceRollerPosition] = useState({x: 0, y: 0})

  function closeModalDialogs(){
    setDiceRollerVisible(false)
    console.log("meow")
  }

  function openDiceRoller(event: any, roll : {dice: string, bonus: string}){
    setDiceRollerVisible(true);
    setDiceRollerPosition({x: event.target.offsetLeft + event.target.offsetWidth + 5, y: event.target.offsetTop})
    setNextRoll(roll);
  }

  function getInitiativeBonus() : string {
    let bonus = (
      getAbilityMod(props.charData.abilities.dex_score)
      + getDisplayBonus(props.charData.initiative_adds)
    )
    return bonus >= 0 ? "+"+bonus : "-"+bonus
  }

  function getDisplayBonus(adds : Bonus[]){
    let result = 0;
    adds.forEach((add) => {result += add.flat});
    return result;
  }

  function getAC(){
    return 10 + getAbilityMod(props.charData.abilities.dex_score) + getDisplayBonus(props.charData.ac_adds)
  }

  function getAbilityMod(score: number){
    if (score >= 10 && score <= 11){
      return 0
    } else if (score <= 8){
      return Math.ceil((Math.abs(10-score)/2)) * -1
    } else {
      return Math.floor((score-10)/2)
    }
  }

  function displayHitDice(displayType : "remaining"|"total"){
    let result = ""
    props.charData.hitDice.forEach((hd : HitDice) => {
      let nextDice = displayType=="remaining" ? hd.remaining : hd.total
      if (nextDice > 0){
        result += nextDice + "d" + hd.type + "  "
      }
    })
    return result
  }

  function stringArrayToString(strings: []){
    let result = "";
    strings.forEach((e : string) => {result += e + "\n"});
    return result;
  }

  return (
    <div id="sheet">
      
      {/* 1st row */}
      <div className="sheet-grouping sheet-row">
        <div id="sheet-con-charname">
          <label id="sheet-data-charname">{props.charData.name}</label>
        </div>
        <div id="sheet-con-classlevel">
          <label id="sheet-data-classlevel">{props.charData.classLevel}</label><br/>
        </div>
        <div id="sheet-con-lineage">
          <label id="sheet-data-lineage">{props.charData.lineage}</label><br/>
        </div>
      </div>

      {/* 2nd row */}
      <div className="sheet-grouping sheet-row">
        <div className="sheet-grouping sheet-row" id="sheet-con-group-initiative">
          <div id="sheet-con-initiative">
            <label>Initiative</label><br/>
            <button id="sheet-data-initiative" onClick={
              (event) => {
                openDiceRoller(
                  event,
                  {
                    dice: "1d20",
                    bonus: getInitiativeBonus()
                  }
                )}
              }
            >{getInitiativeBonus()}
            </button>
          </div>
          <div id="sheet-con-ac">
            <label>AC</label><br/>
            <label id="sheet-data-ac">{getAC()}</label>
          </div>
          <div id="sheet-con-inspiration">
            <label>Inspiration</label><br/>
            <input type="checkbox" id="sheet-data-inspiration"
            checked={props.charData.inspiration}
            onChange={()=>{}}></input>
          </div>
        </div>
        <div className="sheet-grouping sheet-row" id="sheet-con-group-hp">
          <label className="label-heading">Hit Points</label>
          <div className="sheet-field-annotated">
          <label className="sheet-de-emphasized">Current</label>
            <label id="sheet-data-hp-current">{props.charData.hp.current}</label>
          </div>
          <div className="sheet-field-annotated">
          <label className="sheet-de-emphasized">Maximum</label>
            <label id="sheet-data-hp-max">{props.charData.hp.max + getDisplayBonus(props.charData.hp.max_adds)}</label>
          </div>
          <div className="sheet-field-annotated">
          <label className="sheet-de-emphasized">Temporary</label>
            <label id="sheet-data-hp-temp">{props.charData.hp.temp}</label>
          </div>
        </div>
        <div className="sheet-grouping sheet-row" id="sheet-con-group-hitdice">
          <label className="label-heading">Hit Dice</label>
          <div className="sheet-field-annotated">
          <label className="sheet-de-emphasized">Remaining</label>
            <label id="sheet-data-hitdice-remaining">{displayHitDice("remaining")}</label>
          </div>
          <span className="gap-vertical"/>
          <div className="sheet-field-annotated">
          <label className="sheet-de-emphasized">Total</label>
            <label id="sheet-data-hitdice-total">{displayHitDice("total")}</label>
          </div>
        </div>
        <div className="sheet-grouping sheet-row" id="sheet-con-group-conditions">
          <div id="sheet-con-conditions">
            <label>Conditions</label><br/>
            <textarea disabled id="sheet-data-conditions"
            value={stringArrayToString(props.charData.conditions)}></textarea>
          </div>
        </div>
      </div>

      {/* 3rd row */}
      <div className="sheet-grouping sheet-row">
        <div className="sheet-row" id="sheet-con-group-anatomy">
          <div id="sheet-con-speed">
            <label>Speed</label><br/>
            <label id="sheet-data-speed">{props.charData.speed}</label>
          </div>
          <div id="sheet-con-creaturetype">
            <label>Creature Type</label><br/>
            <label id="sheet-data-creaturetype">{props.charData.creatureType}</label>
          </div>
          <div id="sheet-con-size">
            <label>Size</label><br/>
            <label id="sheet-data-size">{CreatureSize[props.charData.size]}</label>
          </div>
          <div id="sheet-con-senses">
            <label>Senses</label><br/>
            <label id="sheet-data-senses">{stringArrayToString(props.charData.senses)}</label>
          </div>
        </div>
      </div>

      <div className="sheet-row" id="sheet-con-group-main">
        <div className="sheet-column">
          <div className="sheet-row">

            {/* saving throws */}
            <div className="sheet-grouping sheet-column" id="sheet-con-group-abilities">
              <div className="sheet-grouping sheet-ability sheet-column" id="sheet-con-str">
                <div className="sheet-row">
                  <label>Strength</label>
                  <input type="text" className="sheet-input-tiny"></input>
                </div>
                <div className="sheet-row">
                  <label className="sheet-de-emphasized">Save</label>
                  <input type="text" className="sheet-input-tiny"></input>
                </div>
              </div>
              <div className="sheet-grouping sheet-ability sheet-column" id="sheet-con-dex">
                <div className="sheet-row">
                  <label>Dexterity</label>
                  <input type="text" className="sheet-input-tiny"></input>
                </div>
                <div className="sheet-row">
                  <label className="sheet-de-emphasized">Save</label>
                  <input type="text" className="sheet-input-tiny"></input>
                </div>
              </div>
              <div className="sheet-grouping sheet-ability sheet-column" id="sheet-con-con">
                <div className="sheet-row">
                  <label>Constitution</label>
                  <input type="text" className="sheet-input-tiny"></input>
                </div>
                <div className="sheet-row">
                  <label className="sheet-de-emphasized">Save</label>
                  <input type="text" className="sheet-input-tiny"></input>
                </div>
              </div>
              <div className="sheet-grouping sheet-ability sheet-column" id="sheet-con-int">
                <div className="sheet-row">
                  <label>Intelligence</label>
                  <input type="text" className="sheet-input-tiny"></input>
                </div>
                <div className="sheet-row">
                  <label className="sheet-de-emphasized">Save</label>
                  <input type="text" className="sheet-input-tiny"></input>
                </div>
              </div>
              <div className="sheet-grouping sheet-ability sheet-column" id="sheet-con-wis">
                <div className="sheet-row">
                  <label>Wisdom</label>
                  <input type="text" className="sheet-input-tiny"></input>
                </div>
                <div className="sheet-row">
                  <label className="sheet-de-emphasized">Save</label>
                  <input type="text" className="sheet-input-tiny"></input>
                </div>
              </div>
              <div className="sheet-grouping sheet-ability sheet-column" id="sheet-con-cha">
                <div className="sheet-row">
                  <label>Charisma</label>
                  <input type="text" className="sheet-input-tiny"></input>
                </div>
                <div className="sheet-row">
                  <label className="sheet-de-emphasized">Save</label>
                  <input type="text" className="sheet-input-tiny"></input>
                </div>
              </div>
            </div>


            {/* skills */}
            <div className="sheet-grouping"  id="sheet-con-group-skills">
              <label id="sheet-label-proficiency-bonus">Proficiency Bonus</label>
              <input type="text" className="sheet-input-tiny"></input>
              <div></div>
              <div></div>
              <div></div>
              <label className="sheet-de-emphasized">Mod.</label>
              <label className="sheet-de-emphasized">Prof.</label>
              <label className="sheet-de-emphasized">Exp.</label>
              <label>Acrobatics</label>
              <input type="text" className="sheet-skill-input sheet-input-tiny"></input>
              <input type="radio" name="sheet-skill-prof-acrobatics" value="proficient"></input>
              <input type="radio" name="sheet-skill-prof-acrobatics" value="expertise"></input>
              <label>Animal Handling</label>
              <input type="text" className="sheet-skill-input sheet-input-tiny"></input>
              <input type="radio" name="sheet-skill-prof-animal-handling" value="proficient"></input>
              <input type="radio" name="sheet-skill-prof-animal-handling" value="expertise"></input>
              <label>Arcana</label>
              <input type="text" className="sheet-skill-input sheet-input-tiny"></input>
              <input type="radio" name="sheet-skill-prof-arcana" value="proficient"></input>
              <input type="radio" name="sheet-skill-prof-arcana" value="expertise"></input>
              <label>Athletics</label>
              <input type="text" className="sheet-skill-input sheet-input-tiny"></input>
              <input type="radio" name="sheet-skill-prof-athletics" value="proficient"></input>
              <input type="radio" name="sheet-skill-prof-athletics" value="expertise"></input>
              <label>Deception</label>
              <input type="text" className="sheet-skill-input sheet-input-tiny"></input>
              <input type="radio" name="sheet-skill-prof-deception" value="proficient"></input>
              <input type="radio" name="sheet-skill-prof-deception" value="expertise"></input>
              <label>History</label>
              <input type="text" className="sheet-skill-input sheet-input-tiny"></input>
              <input type="radio" name="sheet-skill-prof-history" value="proficient"></input>
              <input type="radio" name="sheet-skill-prof-history" value="expertise"></input>
              <label>Insight</label>
              <input type="text" className="sheet-skill-input sheet-input-tiny"></input>
              <input type="radio" name="sheet-skill-prof-insight" value="proficient"></input>
              <input type="radio" name="sheet-skill-prof-insight" value="expertise"></input>
              <label>Intimidation</label>
              <input type="text" className="sheet-skill-input sheet-input-tiny"></input>
              <input type="radio" name="sheet-skill-prof-intimidation" value="proficient"></input>
              <input type="radio" name="sheet-skill-prof-intimidation" value="expertise"></input>
              <label>Investigation</label>
              <input type="text" className="sheet-skill-input sheet-input-tiny"></input>
              <input type="radio" name="sheet-skill-prof-investigation" value="proficient"></input>
              <input type="radio" name="sheet-skill-prof-investigation" value="expertise"></input>
              <label>Medicine</label>
              <input type="text" className="sheet-skill-input sheet-input-tiny"></input>
              <input type="radio" name="sheet-skill-prof-medicine" value="proficient"></input>
              <input type="radio" name="sheet-skill-prof-medicine" value="expertise"></input>
              <label>Nature</label>
              <input type="text" className="sheet-skill-input sheet-input-tiny"></input>
              <input type="radio" name="sheet-skill-prof-nature" value="proficient"></input>
              <input type="radio" name="sheet-skill-prof-nature" value="expertise"></input>
              <label>Perception</label>
              <input type="text" className="sheet-skill-input sheet-input-tiny"></input>
              <input type="radio" name="sheet-skill-prof-perception" value="proficient"></input>
              <input type="radio" name="sheet-skill-prof-perception" value="expertise"></input>
              <label>Performance</label>
              <input type="text" className="sheet-skill-input sheet-input-tiny"></input>
              <input type="radio" name="sheet-skill-prof-performance" value="proficient"></input>
              <input type="radio" name="sheet-skill-prof-performance" value="expertise"></input>
              <label>Persuasion</label>
              <input type="text" className="sheet-skill-input sheet-input-tiny"></input>
              <input type="radio" name="sheet-skill-prof-persuasion" value="proficient"></input>
              <input type="radio" name="sheet-skill-prof-persuasion" value="expertise"></input>
              <label>Religion</label>
              <input type="text" className="sheet-skill-input sheet-input-tiny"></input>
              <input type="radio" name="sheet-skill-prof-religion" value="proficient"></input>
              <input type="radio" name="sheet-skill-prof-religion" value="expertise"></input>
              <label>Sleight of Hand</label>
              <input type="text" className="sheet-skill-input sheet-input-tiny"></input>
              <input type="radio" name="sheet-skill-prof-sleight-of-hand" value="proficient"></input>
              <input type="radio" name="sheet-skill-prof-sleight-of-hand" value="expertise"></input>
              <label>Stealth</label>
              <input type="text" className="sheet-skill-input sheet-input-tiny"></input>
              <input type="radio" name="sheet-skill-prof-stealth" value="proficient"></input>
              <input type="radio" name="sheet-skill-prof-stealth" value="expertise"></input>
              <label>Survival</label>
              <input type="text" className="sheet-skill-input sheet-input-tiny"></input>
              <input type="radio" name="sheet-skill-prof-survival" value="proficient"></input>
              <input type="radio" name="sheet-skill-prof-survival" value="expertise"></input>
            </div>

          </div>
          <div className="sheet-row">

            {/* misc. proficiencies*/}
            <div className="sheet-grouping sheet-row" id="sheet-con-group-proficiencies">
              <div>
                <label className="label-heading">Languages</label><br/>
                <textarea></textarea>
              </div>
              <div>
                <label className="label-heading">Tool Proficiencies</label><br/>
                <textarea></textarea>
              </div>
              <div>
                <label className="label-heading">Armor & Weapon Proficiencies</label><br/>
                <textarea></textarea>
              </div>
            </div>

            {/* inventory*/}
            <div className="sheet-grouping sheet-column" id="sheet-con-group-inventory">
              <label>Inventory</label><br/>
              <textarea></textarea>
            </div>

          </div>
        </div>

        {/* traits */}
        <div className="sheet-grouping sheet-column" id="sheet-con-group-traits">
          <label className="label-heading">Features, Traits, Spells</label><br/>
          <textarea></textarea>
        </div>

      </div>

      {/* modal overlay */}
      {diceRollerVisible ?
        <div className="sheet-modal-overlay" onClick={closeModalDialogs}>
          <div className="sheet-modal-overlay-inner" onClick={e => e.stopPropagation()}>
            {/* dice roller dialog */}
            {diceRollerVisible ?
              <>
                <div id="dice-roller-offset-left" style={{width: diceRollerPosition.x}}></div>
                <div id="dice-roller-container" style={{top: diceRollerPosition.y}}>
                  <DiceRoller initialDice={nextRoll.dice} initialBonus={nextRoll.bonus}></DiceRoller>
                </div>
              </>
              : null
            }
          </div>
        </div>
        : null
      }
    </div>
  )

}