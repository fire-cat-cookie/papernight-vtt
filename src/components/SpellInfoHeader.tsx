import { GameUtil } from "../operations/GameUtil";
import { Spell } from "../types/Spell";

type Props = {
  selectedSpell: Spell;
};

export default function SpellInfoHeader(props: Props) {
  let selectedSpell = props.selectedSpell;

  if (!selectedSpell) {
    return null;
  }
  let s: Spell = selectedSpell;
  let spellLevel = "";
  switch (selectedSpell.level) {
    case 0:
      spellLevel = "Cantrip";
      break;
    case 1:
      spellLevel = "1st";
      break;
    case 2:
      spellLevel = "2nd";
      break;
    case 3:
      spellLevel = "3rd";
      break;
  }
  if (s.level >= 4 && s.level <= 9) {
    spellLevel = s.level + "th";
  }

  return (
    <div className="builder-multiselect-pane-details-header">
      <div className="builder-table" style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr" }}>
        <div className="builder-content-col">
          <label>Spell Level</label>
          <span>{spellLevel}</span>
        </div>
        <div className="builder-content-col">
          <label>School</label>
          <span>{s.school}</span>
        </div>
        <div className="builder-content-col">
          <label>Ritual</label>
          <span>{s.ritual ? "Yes" : "No"}</span>
        </div>
        <div className="builder-content-col">
          <label>Range</label>
          <span>{s.range}</span>
        </div>
        <div className="builder-content-col">
          <label>Duration</label>
          <span>{GameUtil.Capitalize(s.duration)}</span>
        </div>
      </div>
      <div className="builder-table" style={{ gridTemplateColumns: "3fr 2fr" }}>
        <div className="builder-content-col">
          <label>Components</label>
          <span>{s.components}</span>
        </div>
        <div className="builder-content-col">
          <label>Casting Time</label>
          <span>{s.castingTime}</span>
        </div>
      </div>
    </div>
  );
}
