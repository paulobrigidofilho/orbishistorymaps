import './App.css'
import { Routes, Route } from "react-router-dom"

/* ========== Component Imports ========== */

import Home from './pages/home/Home.jsx'

/* ====================================== */

function App() {

  return (
    <>

      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
     
    </>
  )
}

export default App
