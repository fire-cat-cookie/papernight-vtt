import { useState } from "react"
import DiceRoller from './DiceRoller'
import './CharacterSheet.scss'

export default function CharacterSheet(){

  return (
    <div id="sheet">
      <div className="sheet-grouping sheet-row">

        <div id="sheet-con-charname">
          <label>Character Name</label><br/>
          <input type="text" id="sheet-input-charname"></input>
        </div>
        <div id="sheet-con-classlevel">
          <label>Class & Level</label><br/>
          <input type="text" id="sheet-input-classlevel"></input>
        </div>
        <div id="sheet-con-lineage">
          <label>Lineage</label><br/>
          <input type="text" id="sheet-input-lineage"></input>
        </div>

      </div>

      <div className="sheet-grouping sheet-row">

        <div className="sheet-grouping sheet-row" id="sheet-con-group-initiative">
          <div id="sheet-con-initiative">
            <label>Initiative</label><br/>
            <input type="text" className="sheet-input-tiny" id="sheet-input-initiative"></input>
          </div>
          <div id="sheet-con-ac">
            <label>AC</label><br/>
            <input type="text" className="sheet-input-tiny"  id="sheet-input-ac"></input>
          </div>
          <div id="sheet-con-inspiration">
            <label>Inspiration</label><br/>
            <input type="checkbox" className="sheet-input-tiny"  id="sheet-input-inspiration"></input>
          </div>
        </div>

        <div className="sheet-grouping sheet-row" id="sheet-con-group-hp">
          <label className="label-heading">Hit Points</label>
          <div className="sheet-field-annotated">
            <input type="text" className="sheet-input-tiny"  id="sheet-input-hp-current"></input>
            <label className="sheet-de-emphasized">Current</label>
          </div>
          <div className="sheet-field-annotated">
            <input type="text" className="sheet-input-tiny"  id="sheet-input-hp-max"></input>
            <label className="sheet-de-emphasized">Maximum</label>
          </div>
          <div className="sheet-field-annotated">
            <input type="text" className="sheet-input-tiny"  id="sheet-input-hp-temp"></input>
            <label className="sheet-de-emphasized">Temporary</label>
          </div>
        </div>

        <div className="sheet-grouping sheet-row" id="sheet-con-group-hitdice">
          <label className="label-heading">Hit Dice</label>
          <div className="sheet-field-annotated">
            <input type="text" className="sheet-input-tiny"  id="sheet-input-hitdice-remaining"></input>
            <label className="sheet-de-emphasized">Remaining</label>
          </div>
          <div className="sheet-field-annotated">
            <input type="text" className="sheet-input-tiny"  id="sheet-input-hitdice-total"></input>
            <label className="sheet-de-emphasized">Total</label>
          </div>
        </div>

        <div className="sheet-grouping sheet-row" id="sheet-con-group-conditions">
          <div id="sheet-con-conditions">
            <label>Conditions</label><br/>
            <textarea id="sheet-input-conditions"></textarea>
          </div>
        </div>
        
      </div>

      <div className="sheet-grouping sheet-row">

        <div className="sheet-row" id="sheet-con-group-anatomy">
          <div id="sheet-con-speed">
            <label>Speed</label><br/>
            <input type="text" id="sheet-input-speed"></input>
          </div>
          <div id="sheet-con-creaturetype">
            <label>Creature Type</label><br/>
            <input type="text" id="sheet-input-creaturetype"></input>
          </div>
          <div id="sheet-con-size">
            <label>Size</label><br/>
            <input type="text" id="sheet-input-size"></input>
          </div>
          <div id="sheet-con-senses">
            <label>Senses</label><br/>
            <input type="text" id="sheet-input-senses"></input>
          </div>
        </div>

      </div>

      <div className="sheet-row" id="sheet-con-group-main">

        <div className="sheet-column">
          <div className="sheet-row">
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
            <div className="sheet-grouping sheet-column" id="sheet-con-group-inventory">
              <label>Inventory</label><br/>
              <textarea></textarea>
            </div>
          </div>
        </div>

        <div className="sheet-grouping sheet-column" id="sheet-con-group-traits">
          <label className="label-heading">Features, Traits, Spells</label><br/>
          <textarea></textarea>
        </div>

      </div>

      <DiceRoller></DiceRoller>
    </div>
  )

}