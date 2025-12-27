//  ========== Global imports  ========== //

import "./App.css";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./pages/common/context/AuthContext.jsx";

// ========== Page imports  ========== //

import Home from "./pages/home/Home.jsx";
import Gallery from "./pages/gallery/Gallery.jsx";
import Shop from "./pages/shop/Shop.jsx";
import AboutUs from "./pages/about-us/AboutUs.jsx";
import RegisterForm from "./pages/common/auth/RegisterForm.jsx";
import Profile from "./pages/common/auth/Profile.jsx";
import ForgotPassword from "./pages/common/auth/ForgotPassword.jsx";
import SetNewPassword from "./pages/common/auth/SetNewPassword.jsx";

function App() {
  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

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
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<SetNewPassword />} />
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
