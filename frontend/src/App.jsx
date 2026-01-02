//  ========== Global imports  ========== //

import "./App.css";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./pages/common/context/AuthContext.jsx";
import { SettingsProvider } from "./pages/common/context/SettingsContext.jsx";

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
import MyReviews from "./pages/common/myreviews/MyReviews.jsx";
import MaintenancePage from "./pages/common/components/MaintenancePage.jsx";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminLogin from "./pages/admin/adminpages/AdminLogin/AdminLogin.jsx";
import AdminUsers from "./pages/admin/adminpages/AdminUsers/AdminUsers.jsx";
import AdminProducts from "./pages/admin/adminpages/AdminProducts/AdminProducts.jsx";
import AdminProductForm from "./pages/admin/adminpages/AdminProducts/AdminProductForm.jsx";
import AdminOrders from "./pages/admin/adminpages/AdminOrders/AdminOrders.jsx";
import AdminSettings from "./pages/admin/adminpages/AdminSettings/AdminSettings.jsx";
import AdminReviews from "./pages/admin/adminpages/AdminReviews/AdminReviews.jsx";
import AdminWishlists from "./pages/admin/adminpages/AdminWishlists/AdminWishlists.jsx";

// ========== Route Guard Components  ========== //

import ShopMaintenanceGuard from "./pages/common/guards/ShopMaintenanceGuard.jsx";
import RegistrationMaintenanceGuard from "./pages/common/guards/RegistrationMaintenanceGuard.jsx";
import SiteMaintenanceGuard from "./pages/common/guards/SiteMaintenanceGuard.jsx";

function App() {
  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <>
      <SettingsProvider>
        <AuthProvider>
          <Routes>
            {/* Public Routes with Site Maintenance Guard */}
            <Route path="/" element={<SiteMaintenanceGuard><Home /></SiteMaintenanceGuard>} />
            <Route path="/gallery" element={<SiteMaintenanceGuard><Gallery /></SiteMaintenanceGuard>} />
            <Route path="/aboutus" element={<SiteMaintenanceGuard><AboutUs /></SiteMaintenanceGuard>} />
            
            {/* Shop Routes with Shop Maintenance Guard */}
            <Route path="/shop" element={<ShopMaintenanceGuard><Shop /></ShopMaintenanceGuard>} />
            <Route path="/shop/product/:identifier" element={<ShopMaintenanceGuard><ProductDetail /></ShopMaintenanceGuard>} />
            <Route path="/cart" element={<ShopMaintenanceGuard><Cart /></ShopMaintenanceGuard>} />
            <Route path="/checkout" element={<ShopMaintenanceGuard><Checkout /></ShopMaintenanceGuard>} />
            <Route path="/payment" element={<ShopMaintenanceGuard><Payment /></ShopMaintenanceGuard>} />
            <Route path="/order-confirmation" element={<ShopMaintenanceGuard><OrderConfirmation /></ShopMaintenanceGuard>} />
            <Route path="/wishlist" element={<ShopMaintenanceGuard><WishlistPage /></ShopMaintenanceGuard>} />
            
            {/* Auth Routes with Registration Maintenance Guard */}
            <Route path="/register" element={<RegistrationMaintenanceGuard><RegisterForm /></RegistrationMaintenanceGuard>} />
            <Route path="/profile/:userId" element={<SiteMaintenanceGuard><Profile /></SiteMaintenanceGuard>} />
            <Route path="/forgot-password" element={<SiteMaintenanceGuard><ForgotPassword /></SiteMaintenanceGuard>} />
            <Route path="/reset-password" element={<SiteMaintenanceGuard><SetNewPassword /></SiteMaintenanceGuard>} />
            <Route path="/my-orders" element={<SiteMaintenanceGuard><MyOrders /></SiteMaintenanceGuard>} />
            <Route path="/my-reviews" element={<SiteMaintenanceGuard><MyReviews /></SiteMaintenanceGuard>} />
            
            {/* Maintenance Page (always accessible) */}
            <Route path="/maintenance" element={<MaintenancePage />} />
            
            {/* Admin Login (always accessible - for maintenance mode access) */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Admin Routes (always accessible for admins) */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/products/new" element={<AdminProductForm />} />
            <Route path="/admin/products/edit/:productId" element={<AdminProductForm />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/reviews" element={<AdminReviews />} />
            <Route path="/admin/wishlists" element={<AdminWishlists />} />
          </Routes>
        </AuthProvider>
      </SettingsProvider>
    </>
  );
}

export default App;
