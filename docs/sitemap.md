# Orbis Project - Comprehensive Sitemap

This document serves as the main index for the Orbis project documentation.

**Design Theme:** Gold (#D4AF37) and Black inspired by Orbis branding

---

## 📋 Documentation Index

### Core Flows
- **[Main Application Flow](./flows/main-application-flow.md)** - Overall navigation and page structure
- **[Authentication Flow](./flows/authentication-flow.md)** - Login, registration, and session management ✅ IMPLEMENTED
- **[Profile Management Flow](./flows/profile-management-flow.md)** - User profile viewing and editing ✅ IMPLEMENTED

### E-Commerce Features
- **[Shop & Cart Flow](./flows/shop-cart-flow.md)** - Product browsing, cart, wishlist, checkout with freight ✅ IMPLEMENTED
- **[Interactive Gallery Flow](./flows/gallery-flow.md)** - Product gallery with history and maps 🔄 PLANNED

### Other Features
- **[About Us & Contact Flow](./flows/about-contact-flow.md)** - Company information and contact form 🔄 PLANNED
- **[Password Reset Flow](./flows/password-reset-flow.md)** - Forgot password and reset functionality ✅ IMPLEMENTED

### Architecture
- **[System Architecture Overview](./architecture/system-architecture.md)** - Complete system design (Sequelize ORM) ✅
- **[API Architecture & Design](./architecture/api-architecture.md)** - REST API endpoints and specifications ✅
- **[Component Architecture](./architecture/component-architecture.md)** - Frontend component hierarchy and patterns ✅
- **[Database Schema](./architecture/database-schema.md)** - PostgreSQL tables with Sequelize models ✅
- **[Page Hierarchy](./architecture/page-hierarchy.md)** - Complete page structure and routing ✅
- **[Navigation Structure](./architecture/navigation-structure.md)** - Nav bar and menu organization ✅
- **[User Roles & Permissions](./architecture/user-roles.md)** - Access control and permissions ✅

### Quickstart Guides
- **[Shop Structure](./quickstart/shop-structure.md)** - Shop module file structure and components ✅
- **[Wishlist System](./quickstart/wishlist-system.md)** - Complete wishlist feature guide ✅
- **[Notification System](./quickstart/notification-system.md)** - FadeNotification component usage ✅
- **[Admin System](./quickstart/admin-system.md)** - Complete admin panel and management system ✅
- **[Password Reset](./quickstart/password-reset.md)** - Password reset flow and implementation ✅
- **[Authentication System](./quickstart/authentication.md)** - Login, registration, and auth flow ✅
- **[Order Management](./quickstart/order-management.md)** - Checkout, orders, and confirmations ✅
- **[Freight System](./quickstart/freight-system.md)** - Zone-based freight calculation ✅ NEW
- **[Address Management](./quickstart/address-management.md)** - Google Places integration ✅ NEW
- **[Review System](./quickstart/review-system.md)** - Product reviews and ratings ✅ NEW

### Charts & Diagrams
- **[Shop & Cart Flow Chart](./charts/shop-cart-flow-chart.md)** - Visual flow with freight calculation ✅
- **[Authentication Flow Chart](./charts/authentication-flow-chart.md)** - Login, registration, and session flows ✅
- **[Profile Management Flow Chart](./charts/profile-management-flow-chart.md)** - Profile viewing and editing ✅
- **[Main Application Flow Chart](./charts/main-application-flow-chart.md)** - Overall navigation flows ✅

---

## 🎨 Brand Colors

- **Primary (Gold):** `#D4AF37`
- **Secondary (Black):** `#1a1a1a`
- **Error (Red):** `#cc0000`
- **Success (Green):** `#4caf50`
- **Info (Blue):** `#2196f3`
- **Google Blue:** `#4285F4`

---

## 📊 Project Status

**Version:** 3.0 (Sequelize ORM Edition)  
**Status:** Active Development  
**Last Updated:** January 4, 2026

### ✅ Implemented Features

**Authentication & User Management:**
- ✅ User registration with multi-step form
- ✅ User login with session management
- ✅ Logout functionality
- ✅ Profile viewing and editing
- ✅ Avatar upload and deletion
- ✅ Password reset flow with email
- ✅ Session persistence across refreshes

**E-Commerce (Shop & Cart):**
- ✅ Product catalog with database
- ✅ Product cards with images
- ✅ Product detail pages
- ✅ Filter and sort functionality
- ✅ Shopping cart for guests (session-based)
- ✅ Shopping cart for authenticated users
- ✅ Add to cart with quantity selection
- ✅ Update cart item quantities
- ✅ Remove individual cart items
- ✅ Clear entire cart
- ✅ Cart badge with live count
- ✅ Guest cart merge on login/registration
- ✅ Cart persistence via sessions
- ✅ Proceed to Checkout with auth check
- ✅ LoginModal integration for guests

**Wishlist System:**
- ✅ Add/remove products from wishlist
- ✅ WishlistToggleBtn (heart icon)
- ✅ Wishlist page with all saved items
- ✅ Add to cart from wishlist
- ✅ Wishlist badge with live count
- ✅ Real-time wishlist updates
- ✅ Authentication required for wishlist

**Freight & Shipping System (NEW):**
- ✅ Zone-based freight calculation
- ✅ Local zone (Tauranga/Mount Maunganui)
- ✅ North/South Island zones (NZ)
- ✅ International zones (NA, Asia, Europe, LatAm, Africa)
- ✅ Free shipping thresholds per zone
- ✅ Google Places Address Autocomplete
- ✅ AddressAutocomplete component
- ✅ FreightCostDisplay component
- ✅ Zone detection helper (608 cities)
- ✅ 8 supported countries

**Product Reviews (NEW):**
- ✅ Submit product reviews
- ✅ Star rating system (1-5)
- ✅ Review approval workflow
- ✅ Admin review moderation
- ✅ Average rating calculation
- ✅ Review responses by admin

**Admin System (Expanded):**
- ✅ User management (list, edit, roles)
- ✅ Product management (CRUD, images)
- ✅ Order management (status, tracking) ✨
- ✅ Review moderation ✨
- ✅ Wishlist analytics ✨
- ✅ Site settings management ✨
- ✅ Freight configuration ✨

**Notification System:**
- ✅ FadeNotification reusable component
- ✅ Success, error, info variants
- ✅ Position variants (right, top, bottom)
- ✅ Auto-dismiss with fade animation
- ✅ Material Icons integration

**Checkout & Orders:**
- ✅ Shipping address form with Google autocomplete ✨
- ✅ Freight cost calculation ✨
- ✅ Payment method selection
- ✅ Order creation with freight zone ✨
- ✅ Order confirmation page
- ✅ Order history with tracking ✨

### 🔄 In Progress Features

- Payment gateway integration (Stripe)
- Email order confirmations
- Order tracking page

### 📝 Planned Features

- Interactive gallery with maps
- About Us page
- Contact form
- Advanced reporting dashboard
- Discount codes
- Gift wrapping

---

## 🗺️ Application Routes

### Public Routes
| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home | Landing page |
| `/shop` | Shop | Product catalog |
| `/shop/:identifier` | ProductDetail | Product details |
| `/about` | About | Company info |
| `/contact` | Contact | Contact form |

### Auth Routes
| Route | Component | Description |
|-------|-----------|-------------|
| `/login` | Login | User login |
| `/register` | Register | Multi-step registration |
| `/forgot-password` | ForgotPassword | Request reset |
| `/reset-password/:token` | ResetPassword | Reset form |

### User Routes (Protected)
| Route | Component | Description |
|-------|-----------|-------------|
| `/profile` | Profile | User profile |
| `/profile/edit` | ProfileEdit | Edit profile |
| `/cart` | Cart | Shopping cart |
| `/checkout` | Checkout | Shipping address ✨ |
| `/payment` | Payment | Payment method |
| `/order-confirmation` | OrderConfirmation | Order success |
| `/wishlist` | Wishlist | Saved items |
| `/orders` | OrderHistory | Order history |

### Admin Routes (Protected)
| Route | Component | Description |
|-------|-----------|-------------|
| `/admin` | AdminDashboard | Dashboard overview |
| `/admin/users` | AdminUsers | User management |
| `/admin/products` | AdminProducts | Product CRUD |
| `/admin/orders` | AdminOrders | Order management ✨ |
| `/admin/reviews` | AdminReviews | Review moderation ✨ |
| `/admin/wishlists` | AdminWishlists | Wishlist analytics ✨ |
| `/admin/settings` | AdminSettings | Site settings ✨ |
| `/admin/freight` | AdminFreight | Freight zones ✨ |

---

## 🚀 Future Enhancements

See [Future Enhancements](./future-enhancements.md) for detailed roadmap.
