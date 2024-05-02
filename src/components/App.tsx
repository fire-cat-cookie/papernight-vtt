import { useState } from 'react'
import './App.scss'
import CharacterSheet from './CharacterSheet'
import Header from './Header'

export default function App() {

  return (
    <>
      <Header title="Papernight VTT"/>
      <CharacterSheet/>
    </>
  )
}