import './App.css'
import { Routes, Route } from "react-router-dom"
import { AuthProvider } from './pages/common/context/AuthContext.jsx'; 

/* ========== Component Imports ========== */

import Home from './pages/home/Home.jsx'
import Gallery from './pages/gallery/Gallery.jsx'
import Shop from './pages/shop/Shop.jsx'
import AboutUs from './pages/about-us/AboutUs.jsx'
import RegisterForm from './pages/common/auth/RegisterForm.jsx' 
import Profile from './pages/common/auth/Profile.jsx' 


/* ====================================== */

function App() {

  return (
    <>
      <AuthProvider> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/profile/:userId" element={<Profile />} />
        </Routes>
      </AuthProvider>
    </>
  )
}

export default App
