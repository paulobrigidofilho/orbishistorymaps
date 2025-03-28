import './App.css'
import { Routes, Route } from "react-router-dom"
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider

/* ========== Component Imports ========== */

import Home from './pages/home/Home.jsx'
import Gallery from './pages/gallery/Gallery.jsx'
import Shop from './pages/shop/Shop.jsx'
import AboutUs from './pages/about-us/AboutUs.jsx'
import Register from './pages/register/Register.jsx' // Import Register

/* ====================================== */

function App() {

  return (
    <>
      <AuthProvider> {/* Wrap Routes with AuthProvider */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/register" element={<Register />} /> {/* Add Register route */}
        </Routes>
      </AuthProvider>
    </>
  )
}

export default App
