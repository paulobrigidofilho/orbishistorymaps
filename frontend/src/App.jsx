//  ========== Global imports  ========== //

import "./App.css";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./pages/common/context/AuthContext.jsx";

// ========== Page imports  ========== //

import Home from "./pages/home/Home.jsx";
import Gallery from "./pages/gallery/Gallery.jsx";
import Shop from "./pages/shop/Shop.jsx";
import ProductDetail from "./pages/shop/ProductDetail.jsx";
import Cart from "./pages/shop/Cart.jsx";
import Checkout from "./pages/shop/Checkout.jsx";
import Payment from "./pages/shop/Payment.jsx";
import OrderConfirmation from "./pages/shop/OrderConfirmation.jsx";
import AboutUs from "./pages/about-us/AboutUs.jsx";
import RegisterForm from "./pages/common/auth/RegisterForm.jsx";
import Profile from "./pages/common/auth/Profile.jsx";
import ForgotPassword from "./pages/common/auth/ForgotPassword.jsx";
import SetNewPassword from "./pages/common/auth/SetNewPassword.jsx";
import WishlistPage from "./pages/common/wishlist/WishlistPage.jsx";
import MyOrders from "./pages/common/myorders/MyOrders.jsx";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminUsers from "./pages/admin/adminpages/AdminUsers/AdminUsers.jsx";
import AdminProducts from "./pages/admin/adminpages/AdminProducts/AdminProducts.jsx";
import AdminProductForm from "./pages/admin/adminpages/AdminProducts/AdminProductForm.jsx";
import AdminOrders from "./pages/admin/adminpages/AdminOrders/AdminOrders.jsx";
import AdminSettings from "./pages/admin/adminpages/AdminSettings/AdminSettings.jsx";
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
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/my-orders" element={<MyOrders />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/products/new" element={<AdminProductForm />} />
          <Route path="/admin/products/edit/:productId" element={<AdminProductForm />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
