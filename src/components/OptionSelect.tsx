import React from "react"
import "./CharacterBuilder.scss";
import "./CharacterBuilderClass.scss";
import { Feature } from "../types/Feature";
import { CharDataAction } from "../operations/CharDataReducer";
import { Class } from "../types/Class";

type Props = {
  selectedClass: Class;
  feature:Feature;
  updateCharData: React.Dispatch<CharDataAction>;
}

export default function OptionSelect(props: Props){
  let 
  let choicesTotal = props.feature.
  let choicesRemaining

  function Header(){
    return (
      <div className="builder-content-col">
        {totalCantrips > 0 && (
          <label>{"Choices available: " + optionsAvailable + "/" + totalCantrips}</label>
        )}
        {totalSpells > 0 && (
          <label>{"Spells available: " + availableSpells + "/" + totalSpells}</label>
        )}
      </div>)
  }
  function OptionList(){
    return (<React.Fragment></React.Fragment>)
  }
  function OptionDetails(){
    return (<React.Fragment></React.Fragment>)
  }

  return (
    <React.Fragment>
      {Header()}
      <div className="builder-multiselect">
        {OptionList()}
        {OptionDetails()}
      </div>
      
    </React.Fragment>
  )
}