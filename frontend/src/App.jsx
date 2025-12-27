//  ========== Global imports  ========== //

import "./App.css";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./pages/common/context/AuthContext.jsx";

// ========== Page imports  ========== //

import Home from "./pages/home/Home.jsx";
import Gallery from "./pages/gallery/Gallery.jsx";
import Shop from "./pages/shop/Shop.jsx";
import ProductDetail from "./pages/shop/ProductDetail.jsx";
import Cart from "./pages/shop/Cart.jsx";import Checkout from "./pages/shop/Checkout.jsx";
import Payment from "./pages/shop/Payment.jsx";
import OrderConfirmation from "./pages/shop/OrderConfirmation.jsx";import AboutUs from "./pages/about-us/AboutUs.jsx";
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
          <Route path="/shop/product/:identifier" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
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
