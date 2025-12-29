///////////////////////////////////////////////////////////////////////
// ===================== SHOP & CART FLOW ============================ //
///////////////////////////////////////////////////////////////////////

/**
 * DOCUMENT PURPOSE:
 * Complete e-commerce flow including product browsing, cart management,
 * wishlist functionality, and checkout with guest and authenticated users.
 * 
 * STATUS: ✅ IMPLEMENTED
 * LAST UPDATED: December 29, 2025
 * VERSION: 2.0
 */

---

## 📊 Flow Diagram

See [Shop Cart Flow Chart](../charts/shop-cart-flow-chart.md) for the visual flow diagram.

---

## 🔄 User Flows

### 1. Guest Shopping Flow

```
Browse Products → View Product Details → Add to Cart (Guest)
    ↓
Guest Cart Stored (Session-Based via req.sessionID)
    ↓
Proceed to Checkout → LoginModal Opens
    ↓
Login or Register → Guest Cart Merges Automatically → Continue to Checkout
```

**Key Implementation Details:**
- Session initialized on first `addToCart` action
- Backend stores cart with `session_id` when `user_id` is null
- Session cookie persists cart across page refreshes
- Automatic cart merge via `mergeCart()` after authentication
- All requests use `withCredentials: true` for session cookies

### 2. Authenticated User Shopping Flow

```
Browse Products → View Details → Add to Cart / Add to Wishlist
    ↓
View Cart → Update Quantities → Remove Items
    ↓
Proceed to Checkout → Enter Shipping Address
    ↓
Select Payment Method → Place Order
    ↓
Order Confirmation Page → Email Confirmation
```

### 3. Wishlist Integration Flow

```
Product Page → Click Wishlist Heart Icon → Toggle Added/Removed
    ↓
View Wishlist Page → See All Saved Items
    ↓
Add to Cart from Wishlist → Navigate to Cart
```

**Features:**
- Heart icon toggle button (filled when in wishlist)
- FadeNotification for instant feedback
- Real-time wishlist badge count
- Wishlist requires authentication

---

## 🛠️ Technical Implementation

### Session Management (Guest Cart)

**Backend Session Configuration:**
```javascript
// authConfig.js
session: {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,  // Only save when data added
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  }
}
```

**cartController.js - Guest Session Initialization:**
```javascript
// For guests, mark session as initialized to ensure sessionID persists
if (!userId && !req.session.guestCartInitialized) {
  req.session.guestCartInitialized = true;
}

const userId = req.session?.user?.id || null;
const sessionId = req.sessionID;
```

**Why This Matters:**
- `saveUninitialized: false` prevents session creation for every request
- Guest session is explicitly initialized when adding to cart
- Session cookie is sent to browser, ensuring `req.sessionID` persists
- Without this, guest cart would appear empty on subsequent requests

### Cart Services & API Calls

**Frontend Services (orbis/frontend/src/pages/shop/functions/cartService/):**

| Service | Purpose | Endpoint |
|---------|---------|----------|
| `getCart.js` | Fetch cart (guest or user) | `GET /api/cart` |
| `addToCart.js` | Add product to cart | `POST /api/cart/items` |
| `updateCartItem.js` | Update item quantity | `PUT /api/cart/items/:cartItemId` |
| `removeCartItem.js` | Remove single item | `DELETE /api/cart/items/:cartItemId` |
| `clearCart.js` | Clear all cart items | `DELETE /api/cart/:cartId` |
| `mergeCart.js` | Merge guest cart on login | `POST /api/cart/merge` |

**All requests use:**
```javascript
{ withCredentials: true }  // Sends session cookie
```

### Cart Merge on Authentication

**Triggered From:**
- `AuthContext.jsx` - After successful login
- `Register.jsx` - After successful registration

**Flow:**
```javascript
// 1. User logs in/registers (guest cart exists with items)
await mergeCart();

// 2. Backend updates cart record
UPDATE cart SET user_id = ?, session_id = NULL 
WHERE session_id = ?

// 3. Frontend updates UI
window.dispatchEvent(new Event("cartUpdated"));
```

### Notification System

**FadeNotification Component:**
- Reusable notification popup
- Auto-dismiss after configurable duration
- Fade out animation
- Position variants: `right`, `top`, `bottom`
- Type variants: `success`, `error`, `info`

**Usage Examples:**

```jsx
// ProductDetail.jsx - Add to cart success (right position)
<FadeNotification
  type="success"
  text="Added to Cart!"
  icon="shopping_cart"
  position="right"
  onComplete={clearNotification}
/>

// WishlistItem.jsx - Add to cart from wishlist (top position)
<FadeNotification
  type="success"
  text="Added to Cart!"
  icon="shopping_cart"
  position="top"
  onComplete={clearNotification}
/>
```

---

## 📁 File Structure

```
frontend/src/pages/shop/
├── btn/
│   ├── AddToCartBtn.jsx           # Reusable add to cart button
│   ├── AddToCartBtn.module.css
│   ├── ProceedToCheckoutBtn.jsx   # Shows LoginModal for guests
│   ├── ProceedToCheckoutBtn.module.css
│   ├── QuantitySelector.jsx       # +/- quantity controls
│   └── QuantitySelector.module.css
│
├── components/
│   ├── CartItem.jsx               # Individual cart item display
│   ├── CartItem.module.css
│   ├── ProductCard.jsx            # Product grid item
│   ├── ProductCard.module.css
│   ├── ProductGrid.jsx            # Grid layout wrapper
│   └── ProductGrid.module.css
│
├── constants/
│   ├── shopConstants.js           # API endpoints, categories
│   └── cartConstants.js           # Cart messages, payment methods
│
├── functions/
│   ├── cartService/
│   │   ├── addToCart.js          # POST /api/cart/items
│   │   ├── getCart.js            # GET /api/cart
│   │   ├── updateCartItem.js     # PUT /api/cart/items/:id
│   │   ├── removeCartItem.js     # DELETE /api/cart/items/:id
│   │   ├── clearCart.js          # DELETE /api/cart/:id
│   │   └── mergeCart.js          # POST /api/cart/merge
│   │
│   ├── productService/
│   │   ├── getAllProducts.js     # GET /api/products
│   │   └── getProductDetails.js  # GET /api/products/:identifier
│   │
│   ├── fetchCart.js              # Wrapper for getCart with state
│   ├── handleAddToCart.js        # Add to cart with notifications
│   ├── handleUpdateQuantity.js   # Update quantity handler
│   ├── handleRemoveItem.js       # Remove item handler
│   └── handleClearCart.js        # Clear cart handler
│
├── helpers/
│   ├── calculateCartTotal.js     # Calculate totals and subtotals
│   ├── handleQuantityChange.js   # Quantity increment/decrement
│   └── showMessage.js            # Display inline messages
│
├── validators/
│   ├── cartValidator.js          # Validate quantity, checkout readiness
│   └── checkoutValidator.js      # Validate address, payment method
│
├── Cart.jsx                       # Shopping cart page
├── Cart.module.css
├── Checkout.jsx                   # Shipping address form
├── Checkout.module.css
├── OrderConfirmation.jsx          # Order success page
├── OrderConfirmation.module.css
├── Payment.jsx                    # Payment method selection
├── Payment.module.css
├── ProductDetail.jsx              # Product detail with add to cart
├── ProductDetail.module.css
├── Shop.jsx                       # Main shop page with filters
└── Shop.module.css

backend/src/
├── controllers/
│   └── cartController.js         # Cart HTTP request handlers
├── services/
│   └── cartService.js            # Cart business logic
├── model/
│   └── cartModel.js              # Cart database operations
└── routes/
    └── cartRoutes.js             # Cart API route definitions
```

---

## 🎨 UI Components & Interactions

### Cart Badge (MainNavBar)
- **Location:** Top right navigation bar
- **Displays:** Total quantity of items in cart
- **Updates:** On `cartUpdated` custom event
- **Behavior:** Auto-refreshes every 5 seconds
- **Access:** Available to both guests and authenticated users

### Wishlist Badge (MainNavBar)
- **Location:** Top right navigation bar (left of cart)
- **Displays:** Count of wishlist items
- **Updates:** On `wishlistUpdated` custom event
- **Behavior:** Auto-refreshes every 10 seconds
- **Access:** Authenticated users only

### AddToCartBtn Component
**Props:**
- `onClick` - Click handler function
- `loading` - Boolean loading state
- `isInCart` - Boolean (changes text to "View Cart")
- `disabled` - Boolean disabled state
- `showIcon` - Boolean to show/hide cart icon
- `size` - `"small" | "medium" | "large"`

**States:**
- Default: "Add to Cart" with cart icon
- Loading: Spinner animation
- In Cart: "View Cart" with checkmark icon

### WishlistToggleBtn Component
**Props:**
- `productId` - Product UUID (required)
- `onStatusChange` - Optional callback function

**Features:**
- Heart icon toggle (filled = in wishlist, outlined = not in wishlist)
- FadeNotification on add/remove
- Requires user authentication
- Dispatches `wishlistUpdated` event

### ProceedToCheckoutBtn Component
**Props:**
- `show` - Boolean visibility toggle
- `showIcon` - Boolean to show/hide icon
- `size` - `"small" | "medium" | "large"`

**Behavior:**
- If user authenticated → Navigate to `/cart`
- If guest user → Show `LoginModal` component
- Appears after successfully adding item to cart

---

## ✅ Validation Rules

### Cart Validation (cartValidator.js)

**validateQuantity(quantity, availableStock)**
- Ensures quantity ≥ 1
- Ensures quantity ≤ available stock
- Returns `{isValid: boolean, message: string}`

**validateCartForCheckout(cartItems)**
- Checks cart is not empty
- Validates all items have valid quantities
- Ensures all products are in stock
- Returns `{isValid: boolean, message: string}`

### Checkout Validation (checkoutValidator.js)

**validateShippingAddress(addressData)**
- Required fields: `fullName`, `addressLine1`, `city`, `state`, `zipCode`, `country`
- ZIP code format validation
- Returns `{isValid: boolean, errors: object}`

**validatePaymentMethod(paymentMethod)**
- Must be one of: `"credit_card"`, `"debit_card"`, `"paypal"`, `"bank_transfer"`
- Returns `{isValid: boolean, message: string}`

---

## 🔐 Security & Best Practices

### Session Security
```javascript
// Session cookies are configured with:
httpOnly: true        // Prevents XSS attacks
sameSite: "lax"       // CSRF protection
secure: true          // HTTPS only (production)
maxAge: 24h           // Auto-expiration
```

### Authentication Requirements
| Feature | Guest Access | User Access |
|---------|--------------|-------------|
| Browse Products | ✅ Yes | ✅ Yes |
| View Product Details | ✅ Yes | ✅ Yes |
| Add to Cart | ✅ Yes | ✅ Yes |
| View Cart | ✅ Yes | ✅ Yes |
| Update Cart | ✅ Yes | ✅ Yes |
| Wishlist | ❌ No | ✅ Yes |
| Checkout | ❌ No (redirects to login) | ✅ Yes |
| Place Order | ❌ No | ✅ Yes |

### Data Validation
- **Backend:** All inputs validated before database operations
- **Frontend:** Client-side validation for immediate feedback
- **Stock Check:** Real-time availability verification
- **Price Integrity:** Prices stored at time of addition to cart

---

## 📊 Event System

### Custom Events

**cartUpdated**
```javascript
window.dispatchEvent(new Event("cartUpdated"));
```
**Triggered By:**
- Adding item to cart
- Updating item quantity
- Removing item from cart
- Clearing cart
- Merging guest cart on login

**Listened By:**
- CartBtn component (updates badge)
- Cart page (refreshes data)
- WishlistItem component (checks cart status)

**wishlistUpdated**
```javascript
window.dispatchEvent(new Event("wishlistUpdated"));
```
**Triggered By:**
- Adding item to wishlist
- Removing item from wishlist

**Listened By:**
- WishlistBtn component (updates badge)
- WishlistToggleBtn component (updates icon state)

---

## 🔗 Related Documentation

- **[Authentication Flow](./authentication-flow.md)** - Login/register with cart merge
- **[Wishlist System](../quickstart/wishlist-system.md)** - Complete wishlist documentation
- **[Shop API Reference](../quickstart/shop-api-reference.md)** - All API endpoints
- **[Notification System](../quickstart/notification-system.md)** - FadeNotification component
- **[Shop Structure](../quickstart/SHOP_STRUCTURE.md)** - Complete module structure

---

## 🎯 Future Enhancements

- [ ] Product reviews and ratings
- [ ] Save for later functionality
- [ ] Cart expiration for abandoned carts
- [ ] Recently viewed products
- [ ] Product recommendations
- [ ] Email cart reminders
- [ ] Gift wrapping options
- [ ] Discount codes and coupons

---

**Document Version:** 2.0  
**Last Updated:** December 29, 2025  
**Maintained By:** Development Team
