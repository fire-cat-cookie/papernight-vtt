import { useState, useReducer, useEffect } from "react";
import "./App.scss";
import CharacterSheet from "./CharacterSheet";
import Header from "./Header";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import CharacterBuilder from "./CharacterBuilder";
import CharacterBuilderLineage from "./CharacterBuilderLineage";
import CharacterBuilderClass from "./CharacterBuilderClass";
import CharacterBuilderAbilities from "./CharacterBuilderAbilities";
import CharacterBuilderBackground from "./CharacterBuilderBackground";
import CharacterBuilderEquipment from "./CharacterBuilderEquipment";
import { charDataReducer as charDataReducer } from "../operations/CharDataReducer";
import { initialCharData } from "../operations/InitCharData";
import { ComposeChar } from "../operations/ComposeChar";

export default function App() {
  const [charData, updateCharData] = useReducer(charDataReducer, initialCharData);
  const [isInitialized, setIsInitialized] = useState(false);
  let charComposed = ComposeChar(charData);

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  if (!isInitialized) {
    return null;
  }

  return (
    <Router>
      <Header title="Papernight VTT" />
      <Routes>
        <Route
          path="/"
          element={<CharacterSheet char={charComposed} updateCharData={updateCharData} />}
        ></Route>
        <Route
          path="/builder"
          element={<CharacterBuilder charData={charData} updateCharData={updateCharData} />}
        >
          <Route
            path="lineage"
            element={
              <CharacterBuilderLineage charData={charData} updateCharData={updateCharData} />
            }
          ></Route>
          <Route
            path="class"
            element={<CharacterBuilderClass charData={charData} updateCharData={updateCharData} />}
          ></Route>
          <Route
            path="abilities"
            element={
              <CharacterBuilderAbilities
                charData={charData}
                charComposed={charComposed}
                updateCharData={updateCharData}
              />
            }
          ></Route>
          <Route
            path="background"
            element={
              <CharacterBuilderBackground charData={charData} updateCharData={updateCharData} />
            }
          ></Route>
          <Route
            path="equipment"
            element={
              <CharacterBuilderEquipment charData={charData} updateCharData={updateCharData} />
            }
          ></Route>
        </Route>
      </Routes>
    </Router>
  );
}
