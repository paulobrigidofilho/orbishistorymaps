---

<!--
  ORBIS User Roles & Permissions Architecture
  
  Document Type: System Architecture & Access Control
  Purpose: User roles, permissions, access control, and security
  Last Updated: December 29, 2025
  
  For page access: see page-hierarchy.md
  For navigation: see navigation-structure.md
-->

# 👥 User Roles & Permissions Architecture

This comprehensive document defines the user types, roles, permissions, and access control system for the Orbis application, including implementation details and security considerations.

---

## 📋 Overview

### User Types
- **Guest User** - Unauthenticated, session-based cart
- **Registered User** - Authenticated, full account access
- **Admin User** - Special role, management features (future)

### Access Control Method
- **Frontend:** AuthContext checks, ProtectedRoute wrappers
- **Backend:** Middleware validates session, checks user role
- **Storage:** Role stored in database, session cookie
- **Enforcement:** API endpoints validate permissions

---

## 👤 User Type Definitions

### 1️⃣ Guest User (Unauthenticated)

```
Status: Not logged in
Session: Browser session ID (server-side)
Authentication: None
Cart: Session-based (temporary)
Profile: No profile data
```

#### Permissions
- ✅ View all public pages (Home, Shop, Gallery, About)
- ✅ Browse products
- ✅ View product details
- ✅ Search products
- ✅ Add items to cart (local session)
- ✅ Remove items from cart
- ✅ Update item quantities
- ✅ Clear cart
- ✅ Access registration page
- ✅ Access login modal
- ✅ Submit contact form
- ❌ Proceed to checkout
- ❌ Save profile
- ❌ Upload avatar
- ❌ Access order history
- ❌ Access wishlist
- ❌ Edit preferences
- ❌ View admin panel

#### Cart Management
- **Storage:** Browser session cookie (on server)
- **Persistence:** Session expires (24-30 days)
- **Merge on Login:** Guest cart items transferred to user cart
- **Session ID:** Tracked server-side
- **Cart Endpoint:** GET/POST `/api/cart?sessionId=xxx`

#### Features Available
- Browse shop & gallery
- View product details
- Add/remove from cart
- See cart page
- Submit contact form
- Register or login

---

### 2️⃣ Registered User (Authenticated)

```
Status: Logged in
Session: Session ID + httpOnly cookie
Authentication: Email & password verified
Cart: Database-backed user cart
Profile: Full profile with address, avatar
Role: "user" (default)
```

#### Permissions
- ✅ All guest permissions
- ✅ Access profile page
- ✅ Edit personal details (first/last name, email, nickname)
- ✅ Upload & delete avatar
- ✅ Add/edit shipping addresses
- ✅ Change password
- ✅ Complete checkout process
- ✅ Create orders
- ✅ View own order history
- ✅ View own order details
- ✅ Download invoices
- ✅ Add items to wishlist
- ✅ Remove items from wishlist
- ✅ View wishlist
- ✅ Transfer wishlist items to cart
- ✅ View order status updates
- ✅ Request password reset
- ❌ View other users' profiles
- ❌ View other users' orders
- ❌ Edit other users' data
- ❌ Access admin panel
- ❌ Manage products
- ❌ Manage users

#### Profile Features
- **Personal Info:** Editable (name, email, nickname)
- **Avatar:** Uploadable, deletable (5MB max)
- **Address:** Multiple addresses supported
- **Password:** Changeable with current password verification
- **Email:** Verifiable, change with verification
- **Preferences:** Theme, notifications (future)

#### Order Management
- **View Orders:** Complete list with filters
- **View Details:** Full order info, items, tracking
- **Reorder:** Quick reorder from previous orders
- **Download Invoice:** PDF export
- **Track Shipment:** Status updates
- **Contact Support:** Send messages to support

#### Wishlist Features
- **Add Items:** Heart icon on product pages
- **Remove Items:** Manage wishlist page
- **Badge Count:** Show items in navbar
- **Add to Cart:** Quick action
- **Share List:** (future) Share with others
- **Price Alerts:** (future) Notify on price drops

---

### 3️⃣ Admin User (Future Implementation)

```
Status: Logged in
Session: Session ID + httpOnly cookie
Authentication: Email & password verified
Role: "admin" (special role)
```

#### Permissions
- ✅ All user permissions
- ✅ Access admin dashboard
- ✅ View analytics & statistics
- ✅ View all users (list, search, filter)
- ✅ View user profiles & data
- ✅ Edit user details
- ✅ Change user roles (promote/demote)
- ✅ Disable/enable user accounts
- ✅ Ban/unban users
- ✅ View all orders
- ✅ Manage all products
- ✅ Add new products
- ✅ Edit product details
- ✅ Upload product images
- ✅ Manage inventory
- ✅ Set prices & discounts
- ✅ Publish/unpublish products
- ✅ View sales reports
- ✅ Export data
- ✅ Send system messages
- ✅ Configure settings
- ✅ View audit logs

#### Admin Dashboard
- **Overview:** Sales, users, inventory stats
- **Users:** Management, search, edit
- **Products:** CRUD operations, inventory
- **Orders:** View, manage, filter
- **Reports:** Analytics & insights
- **Settings:** System configuration

---

## 🔐 Permission Matrix

### Feature Access by Role

| Feature | Guest | User | Admin |
|---------|-------|------|-------|
| **SHOPPING** |
| View Home | ✅ | ✅ | ✅ |
| Browse Shop | ✅ | ✅ | ✅ |
| View Product Details | ✅ | ✅ | ✅ |
| Search Products | ✅ | ✅ | ✅ |
| View Gallery | ✅ | ✅ | ✅ |
| Add to Cart | ✅ | ✅ | ✅ |
| Remove from Cart | ✅ | ✅ | ✅ |
| Update Quantities | ✅ | ✅ | ✅ |
| **AUTHENTICATION** |
| View About | ✅ | ✅ | ✅ |
| Submit Contact | ✅ | ✅ | ✅ |
| Register Account | ✅ | ✅ | ✅ |
| Login | ✅ | ✅ | ✅ |
| Logout | ❌ | ✅ | ✅ |
| **WISHLIST** |
| View Wishlist | ❌ | ✅ | ✅ |
| Add to Wishlist | ❌ | ✅ | ✅ |
| Remove from Wishlist | ❌ | ✅ | ✅ |
| **CHECKOUT** |
| Proceed to Checkout | ❌ | ✅ | ✅ |
| Enter Shipping Address | ❌ | ✅ | ✅ |
| Select Payment Method | ❌ | ✅ | ✅ |
| Create Order | ❌ | ✅ | ✅ |
| **PROFILE** |
| View Own Profile | ❌ | ✅ | ✅ |
| Edit Profile | ❌ | ✅ Own | ✅ All |
| Upload Avatar | ❌ | ✅ Own | ✅ All |
| Change Password | ❌ | ✅ Own | ✅ All |
| Add Addresses | ❌ | ✅ Own | ✅ All |
| **ORDERS** |
| View Own Orders | ❌ | ✅ | ✅ |
| View Order Details | ❌ | ✅ Own | ✅ All |
| Download Invoice | ❌ | ✅ Own | ✅ All |
| Track Order | ❌ | ✅ Own | ✅ All |
| **ADMIN** |
| View Analytics | ❌ | ❌ | ✅ |
| Manage Users | ❌ | ❌ | ✅ |
| Manage Products | ❌ | ❌ | ✅ |
| Manage Orders | ❌ | ❌ | ✅ |
| View Reports | ❌ | ❌ | ✅ |
| Configure Settings | ❌ | ❌ | ✅ |

---

## 🔑 Implementation

### Frontend Implementation

#### AuthContext Check
```javascript
// In any component
const { user, loading } = useContext(AuthContext);

// Check if authenticated
if (!user) {
  return <LoginModal />;
}

// Check user role
if (user.role === 'admin') {
  return <AdminPanel />;
}
```

#### ProtectedRoute Component
```javascript
<ProtectedRoute adminOnly={true}>
  <AdminPage />
</ProtectedRoute>

// Component checks:
// 1. Is user authenticated?
// 2. Is loading finished?
// 3. If adminOnly: is user.role === 'admin'?
// 4. If not: redirect to home
```

### Backend Implementation

#### Middleware Validation
```javascript
// authMiddleware checks:
// 1. Extract session from cookie
// 2. Query database for session
// 3. Check if session valid & not expired
// 4. Get user from session
// 5. Check user.status (active/banned)
// 6. Attach user to request
// 7. Call next()

// If fails: return 401 Unauthorized
```

#### Route Protection
```javascript
// Public routes: No middleware
// Protected routes: authMiddleware required
// Admin routes: authMiddleware + roleMiddleware

router.get('/api/orders', authMiddleware, getOrders);
// Only authenticated users can get orders

router.get('/api/admin/users', authMiddleware, roleMiddleware('admin'), getUsers);
// Only admins can manage users
```

### Database Storage

#### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  firstName VARCHAR(50),
  lastName VARCHAR(50),
  avatar_url VARCHAR(500),
  role VARCHAR(20) DEFAULT 'user', -- 'user', 'admin'
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'banned'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Sessions Table
```sql
CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  token VARCHAR(255) UNIQUE,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🎯 Access Control Scenarios

### Scenario 1: Guest Browsing Shop
```
Guest user (not authenticated)
  ↓
Navigates to /shop
  ↓
No auth required → Page loads
  ↓
User can browse, add to cart (session-based)
  ↓
Clicks "Checkout"
  ↓
AuthContext.user is null
  ↓
Login modal appears
```

### Scenario 2: User Accessing Profile
```
Registered user (authenticated)
  ↓
Navigates to /profile
  ↓
ProtectedRoute checks AuthContext.user
  ↓
User exists → Allow access
  ↓
ProfilePage loads with user data
  ↓
User can edit personal info, avatar, address
```

### Scenario 3: Guest Accessing Profile
```
Guest user (not authenticated)
  ↓
Navigates to /profile
  ↓
ProtectedRoute checks AuthContext.user
  ↓
User is null → Redirect to home
  ↓
Show notification: "Please login first"
```

### Scenario 4: User Accessing Admin Panel
```
Regular user (authenticated, role: 'user')
  ↓
Navigates to /admin
  ↓
ProtectedRoute checks user.role
  ↓
Role is 'user', not 'admin' → Redirect
  ↓
Show error: "Access Denied (403)"
```

### Scenario 5: Admin Accessing User Panel
```
Admin user (authenticated, role: 'admin')
  ↓
Navigates to /admin/users
  ↓
ProtectedRoute checks user.role
  ↓
Role is 'admin' → Allow access
  ↓
AdminUsersPage loads
  ↓
Can view, edit, delete users
```

---

## 🔒 Security Considerations

### Password Security
- Minimum 8 characters
- Uppercase, lowercase, number required
- Hashed with bcrypt (10 rounds)
- Never transmitted in plain text
- Reset tokens expire after 1 hour

### Session Security
- httpOnly cookie (prevents XSS)
- Secure flag in production (HTTPS only)
- SameSite=Lax (CSRF protection)
- 30-day expiration
- Server-side validation on every request
- Token regeneration recommended

### Data Access Security
- Users can only view/edit own data
- Admins have special role requirement
- API validates permissions server-side
- Audit logs track admin actions
- Sensitive fields masked (passwords, etc.)

### Account Security
- Email verification for new accounts
- Account lockout after failed login attempts
- Admin can disable/ban accounts
- Password reset requires email verification
- Two-factor authentication (future)

---

## 📊 Role Statistics

| Role | Count | Permissions | Features |
|---|---|---|---|
| **Guest** | Unlimited | 7 | View, browse, cart |
| **User** | ~10-100 | 25+ | Shopping, profile, orders |
| **Admin** | 1-5 | 30+ | Full management |

---

## 🔗 Related Documentation

- **[Page Hierarchy](./page-hierarchy.md)** - Pages accessible by role
- **[Navigation Structure](./navigation-structure.md)** - UI for different roles
- **[Authentication Flow](../flows/authentication-flow.md)** - Login/register process
- **[Authentication Quickstart](../quickstart/authentication.md)** - Implementation details

---

**Document Version:** 2.0  
**Last Updated:** December 29, 2025  
**Status:** ✅ Comprehensive