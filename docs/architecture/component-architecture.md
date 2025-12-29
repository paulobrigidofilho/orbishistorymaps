---

<!--
  ORBIS Frontend Component Architecture
  
  Document Type: Component Design & Specifications
  Purpose: Complete component hierarchy, state management, and design patterns
  Last Updated: December 29, 2025
-->

# 🎨 Component Architecture & Design

Comprehensive documentation of the Orbis frontend component system, including component hierarchy, state management patterns, and reusable component specifications.

---

## 📋 Overview

### Component System
- **Framework:** React 18+
- **State Management:** Context API
- **Styling:** CSS Modules + inline styles
- **Routing:** React Router v6
- **Architecture:** Functional components with hooks

### Design Patterns
1. **Container/Presentational Pattern** - Smart vs dumb components
2. **Composition Over Inheritance** - Build with component composition
3. **Props Drilling Prevention** - Context API for shared state
4. **Custom Hooks** - Reusable logic extraction
5. **Single Responsibility** - Each component has one purpose

---

## 🏛️ Component Hierarchy

```
App.jsx (Root)
├── AuthContext (State Provider)
│   ├── Router Setup
│   └── MainNavBar
│       ├── Logo
│       ├── NavigationLinks
│       ├── SearchBar
│       ├── WishlistIcon
│       ├── CartIcon (with badge)
│       └── ProfileButton
│           ├── LoginModal
│           └── UserDropdown
│               ├── ProfileLink
│               ├── OrdersLink
│               └── LogoutButton
│
├── Pages (Routes)
│   ├── HomePage
│   │   ├── Hero Section
│   │   ├── Featured Products
│   │   │   └── ProductCard (reusable)
│   │   └── Newsletter Signup
│   │
│   ├── ShopPage
│   │   ├── Filters
│   │   │   ├── Category Filter
│   │   │   ├── Price Filter
│   │   │   └── Sort Dropdown
│   │   └── ProductGrid
│   │       └── ProductCard (reusable)
│   │
│   ├── ProductDetail
│   │   ├── ProductImages
│   │   ├── ProductInfo
│   │   ├── AddToCart Button
│   │   ├── AddToWishlist Button
│   │   └── Reviews Section
│   │
│   ├── CartPage (Protected)
│   │   ├── CartItemsList
│   │   │   └── CartItem (reusable)
│   │   ├── OrderSummary
│   │   └── CheckoutButton
│   │
│   ├── CheckoutPage (Protected)
│   │   ├── CheckoutProgress
│   │   ├── ShippingForm
│   │   ├── PaymentForm
│   │   └── OrderReview
│   │
│   ├── ProfilePage (Protected)
│   │   ├── PersonalInfo
│   │   │   └── EditPersonalForm
│   │   ├── AddressInfo
│   │   │   └── EditAddressForm
│   │   ├── PasswordSection
│   │   │   └── ChangePasswordForm
│   │   └── AvatarUpload
│   │
│   ├── OrderHistoryPage (Protected)
│   │   ├── OrdersTable
│   │   │   └── OrderRow (reusable)
│   │   └── OrderDetail (modal/drawer)
│   │
│   ├── WishlistPage (Protected)
│   │   └── WishlistItems
│   │       └── WishlistItem (reusable)
│   │
│   ├── GalleryPage
│   │   └── GalleryGrid
│   │       └── GalleryImage (reusable)
│   │
│   ├── AboutPage
│   │   ├── Company Info
│   │   └── Team Section
│   │
│   ├── RegisterPage
│   │   ├── RegisterForm
│   │   └── TermsCheckbox
│   │
│   ├── ForgotPasswordPage
│   │   └── EmailForm
│   │
│   ├── ResetPasswordPage
│   │   └── NewPasswordForm
│   │
│   └── AdminDashboard (Protected, Admin only)
│       ├── DashboardStats
│       ├── UsersManager
│       │   └── UserTable
│       │       └── UserRow (reusable)
│       └── ProductsManager
│           └── ProductTable
│               └── ProductRow (reusable)
│
└── Global Components
    ├── FadeNotification (Toast)
    ├── LoadingSpinner
    ├── Modal
    ├── Drawer
    └── Footer
```

---

## 🎯 Core Components

### App.jsx
**Purpose:** Root component, app initialization, routing
```javascript
// Provider setup
// Router configuration
// Global context wrapping
// Error boundary
// Main layout structure

Structure:
- AuthContext Provider
- BrowserRouter
- Route definitions
- Error handling
```

**Key Props:** None (root)
**State:** None (delegated to Context)
**Responsibilities:**
- Initialize providers
- Setup routing
- Render main layout
- Global error handling

---

### AuthContext.jsx
**Purpose:** Global authentication state management
```javascript
// Manages:
// - Current user data
// - Authentication status
// - Login/Logout logic
// - Session validation
// - Cart for unauthenticated users

Context Value: {
  user,           // Current user object or null
  isAuthenticated, // Boolean
  login(),        // Function to authenticate
  logout(),       // Function to end session
  register(),     // Function to create account
  cartData,       // Cart for guests
  addToCart(),    // Function
  removeFromCart() // Function
}
```

**Hook Usage:**
```javascript
const { user, isAuthenticated, login } = useContext(AuthContext);
```

---

### MainNavBar.jsx
**Purpose:** Primary navigation bar (header)
```
┌─────────────────────────────────────────────┐
│ 📍 Logo  │ Shop Gallery About │ 🔍  🛍️ 👤 │
└─────────────────────────────────────────────┘

Desktop:
- Logo (left)
- Nav links (center)
- Search bar (center-right)
- Wishlist icon (right)
- Cart icon with badge (right)
- Profile menu (right)

Tablet:
- Logo (left)
- Search bar (center)
- Cart & Profile (right)
- Hamburger menu (mobile nav)

Mobile:
- Hamburger menu (left)
- Logo (center)
- Cart & Profile (right)
```

**Props:** None
**State:**
- `mobileMenuOpen` - Boolean
- `dropdownOpen` - Boolean
**Responsibilities:**
- Display navigation links
- Handle responsive behavior
- Show user menu
- Display cart badge
- Search functionality

---

### ProductCard.jsx
**Purpose:** Reusable product display card
```
┌─────────────────────┐
│   Product Image     │
├─────────────────────┤
│ Product Name        │
│ ⭐ 4.5 (25 reviews) │
│ $99.99              │
│ Add to Cart  ❤️     │
└─────────────────────┘
```

**Props:**
```javascript
{
  product: {
    id: string,
    name: string,
    price: number,
    image_url: string,
    rating: number,
    reviews: number,
    inWishlist: boolean
  },
  onAddToCart: function,
  onToggleWishlist: function
}
```

**State:**
- `loading` - Boolean (for async operations)
- `inWishlist` - Boolean

**Responsibilities:**
- Display product info
- Add to cart button
- Wishlist toggle
- Navigate to detail page
- Show price/rating

---

### CartItem.jsx
**Purpose:** Individual cart item in cart page/drawer
```
┌──────────────────────────────────┐
│ Product Name      $99.99         │
│ [Image]  Qty: [1] [+] [-] [X]   │
│                        Subtotal: │
└──────────────────────────────────┘
```

**Props:**
```javascript
{
  item: {
    id: string,
    product: object,
    quantity: number,
    subtotal: number
  },
  onQuantityChange: function,
  onRemove: function
}
```

**State:**
- `loading` - Boolean

**Responsibilities:**
- Display item details
- Quantity controls
- Remove item
- Calculate subtotal
- Show product image

---

### LoginModal.jsx
**Purpose:** Authentication form overlay
```
┌────────────────────────┐
│ X                      │
│    Welcome Back        │
│ Email:    [________]   │
│ Password: [________]   │
│ [ ] Remember me        │
│ [Login] [Sign Up]      │
│ Forgot password?       │
└────────────────────────┘
```

**Props:**
```javascript
{
  isOpen: boolean,
  onClose: function,
  onLoginSuccess: function
}
```

**State:**
- `email` - String
- `password` - String
- `rememberMe` - Boolean
- `loading` - Boolean
- `errors` - Object

**Responsibilities:**
- Email/password validation
- Handle login submission
- Show errors
- Password reset link
- Remember me functionality

---

### ProtectedRoute.jsx
**Purpose:** Route wrapper for authenticated pages
```javascript
// Check if user is authenticated
// If yes: render component
// If no: redirect to home/login

<ProtectedRoute>
  <ProfilePage />
</ProtectedRoute>
```

**Props:**
```javascript
{
  requiredRole: string ('user', 'admin'),
  children: ReactNode
}
```

**Behavior:**
- Validates authentication
- Validates role if required
- Redirects to home if unauthorized
- Shows loading while checking

---

### FadeNotification.jsx
**Purpose:** Toast notification component
```
┌──────────────────────────────────┐
│ ✓ Item added to cart             │
└──────────────────────────────────┘

(fades out after 3 seconds)
```

**Props:**
```javascript
{
  message: string,
  type: 'success' | 'error' | 'info' | 'warning',
  duration: number (ms),
  onClose: function
}
```

**Features:**
- Auto-dismiss
- Custom duration
- Color by type
- Smooth fade animation
- Queue multiple notifications

---

## 📊 State Management Patterns

### Context API Pattern
```javascript
// Create context
const MyContext = React.createContext();

// Create provider component
function MyProvider({ children }) {
  const [state, setState] = useState();
  
  return (
    <MyContext.Provider value={{ state, setState }}>
      {children}
    </MyContext.Provider>
  );
}

// Use in component
function MyComponent() {
  const { state, setState } = useContext(MyContext);
}
```

### Custom Hooks Pattern
```javascript
// Extract reusable logic into custom hooks
function useProductData(productId) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch logic
  }, [productId]);
  
  return { product, loading };
}

// Use in component
function ProductDetail() {
  const { product, loading } = useProductData(productId);
}
```

### Local State vs Context
```
USE LOCAL STATE:
- Form input values
- UI toggles (modal open/close)
- Loading states
- Temporary UI state

USE CONTEXT:
- Current user
- Authentication status
- Cart data
- App-wide preferences
- Theme/language
```

---

## 🎨 Component Specifications

### FormInput Component
```javascript
<FormInput
  label="Email"
  type="email"
  name="email"
  value={formData.email}
  onChange={handleChange}
  error={errors.email}
  required
  placeholder="you@example.com"
/>
```

### Button Component
```javascript
<Button
  variant="primary" | "secondary" | "danger"
  size="small" | "medium" | "large"
  disabled={false}
  loading={false}
  onClick={handleClick}
  className="custom-class"
>
  Button Text
</Button>
```

### Modal Component
```javascript
<Modal
  isOpen={true}
  title="Modal Title"
  onClose={handleClose}
  footerActions={[
    { label: 'Cancel', onClick: handleClose },
    { label: 'Confirm', onClick: handleConfirm }
  ]}
>
  Modal content here
</Modal>
```

### Table Component
```javascript
<Table
  columns={[
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' }
  ]}
  rows={data}
  onRowClick={handleRowClick}
  pagination={{ page, limit, total }}
/>
```

---

## 🔄 Component Communication

### Parent to Child
```javascript
// Via Props
<ProductCard product={product} onAddToCart={handleAdd} />
```

### Child to Parent
```javascript
// Via Callbacks
<ProductCard onAddToCart={(productId) => handleAdd(productId)} />
```

### Sibling/Distant Components
```javascript
// Via Context
<AuthContext.Provider value={value}>
  <ComponentA />
  <ComponentB />
</AuthContext.Provider>
```

### Across Routes
```javascript
// Via Context or URL params
<Route path="/products/:id" element={<ProductDetail />} />
// useParams hook to get id
```

---

## 📋 Component Checklist

### Every Component Should Have:
- [ ] Clear purpose/responsibility
- [ ] PropTypes or TypeScript types
- [ ] JSDoc comments
- [ ] Error handling
- [ ] Loading states
- [ ] Responsive design
- [ ] Accessibility features (alt text, ARIA labels)
- [ ] Consistent styling
- [ ] Unit tests

### Performance Optimization:
- [ ] Use React.memo for expensive renders
- [ ] Memoize callbacks with useCallback
- [ ] Memoize values with useMemo
- [ ] Code splitting for route-based chunks
- [ ] Lazy loading for images

---

## 🔗 Related Documentation

- **[System Architecture](./system-architecture.md)** - Overall design
- **[Navigation Structure](./navigation-structure.md)** - User navigation
- **[Page Hierarchy](./page-hierarchy.md)** - Application pages
- **[Main Application Flow](../flows/main-application-flow.md)** - User journeys

---

**Document Version:** 1.0  
**Last Updated:** December 29, 2025  
**Status:** ✅ Complete