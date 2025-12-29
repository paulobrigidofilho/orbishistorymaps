///////////////////////////////////////////////////////////////////////
// ================ WISHLIST SYSTEM DOCUMENTATION ==================== //
///////////////////////////////////////////////////////////////////////

/**
 * DOCUMENT PURPOSE:
 * Complete guide to the wishlist feature including components, API calls,
 * database structure, and integration with the shop system.
 * 
 * FEATURES: WishlistToggleBtn, WishlistPage, WishlistItem, Real-time updates
 * LAST UPDATED: December 29, 2025
 * VERSION: 1.0
 */

---

## 📋 Overview

The wishlist system allows authenticated users to save products for later purchase. Key features include:

- **Heart-shaped toggle button** on product cards and detail pages
- **Dedicated wishlist page** showing all saved items
- **Add to cart** directly from wishlist
- **Real-time badge updates** in navigation bar
- **FadeNotification** for instant user feedback
- **Authentication required** for all wishlist operations

---

## 🗂️ File Structure

```
frontend/src/pages/common/wishlist/
├── components/
│   ├── WishlistToggleBtn.jsx         # Heart icon toggle button
│   ├── WishlistToggleBtn.module.css
│   ├── WishlistItem.jsx              # Individual wishlist item
│   └── WishlistItem.module.css
│
├── constants/
│   └── wishlistConstants.js          # API endpoints, messages
│
├── functions/
│   ├── addToWishlist.js              # POST /api/wishlist/items
│   ├── removeFromWishlist.js         # DELETE /api/wishlist/items/:productId
│   └── getUserWishlist.js            # GET /api/wishlist
│
├── WishlistPage.jsx                  # Main wishlist page
└── WishlistPage.module.css

backend/src/
├── controllers/
│   └── wishlistController.js         # HTTP request handlers
├── services/
│   └── wishlistService.js            # Business logic
├── model/
│   └── wishlistModel.js              # Database operations
└── routes/
    └── wishlistRoutes.js             # Route definitions
```

---

## 🎨 Components

### 1. WishlistToggleBtn Component

**Location:** `frontend/src/pages/common/wishlist/components/WishlistToggleBtn.jsx`

**Purpose:** Heart-shaped button for adding/removing products from wishlist

**Props:**
```typescript
{
  productId: string;        // Required - Product UUID
  onStatusChange?: (inWishlist: boolean) => void;  // Optional callback
}
```

**Features:**
- Filled heart icon when product in wishlist
- Outlined heart icon when product not in wishlist
- Loading state with pulse animation
- FadeNotification on add/remove actions
- Prevents event bubbling (works inside links)
- Requires user authentication

**Usage Example:**
```jsx
import WishlistToggleBtn from "../common/wishlist/components/WishlistToggleBtn";

<WishlistToggleBtn 
  productId={product.product_id}
  onStatusChange={(isInWishlist) => console.log(isInWishlist)}
/>
```

**States:**
| State | Icon | Color | Behavior |
|-------|------|-------|----------|
| Not in wishlist | `favorite_border` | Gray (#ccc) | Click to add |
| In wishlist | `favorite` | Red (#ff5757) | Click to remove |
| Loading | Current icon | Semi-transparent | Disabled, pulse animation |

**Notification Feedback:**
- ✅ "Added to Wishlist" (success, with `favorite` icon)
- ✅ "Removed from Wishlist" (success, with `favorite_border` icon)
- ❌ "Please login to use wishlist" (error, if not authenticated)
- ❌ Error message if operation fails

---

### 2. WishlistItem Component

**Location:** `frontend/src/pages/common/wishlist/components/WishlistItem.jsx`

**Purpose:** Displays a single wishlist item with product details and actions

**Props:**
```typescript
{
  item: WishlistItemData;    // Wishlist item object
  onRemove: (productId: string) => void;  // Remove handler
  updating: boolean;          // Global loading state
}
```

**Features:**
- Product image with fallback to default
- Product name and category
- Current price (sale price if available)
- Stock status indicator
- "Add to Cart" button
- Remove button
- FadeNotification for actions
- Checks if product already in cart

**Item Data Structure:**
```typescript
interface WishlistItemData {
  wishlist_id: string;
  product_id: string;
  product_name: string;
  product_slug: string;
  primary_image: string;
  category_name: string;
  price: string;
  sale_price: string | null;
  quantity_available: number;
  is_active: boolean;
  created_at: string;
}
```

**Add to Cart Behavior:**
- If not in cart: Add product → Show "Added to Cart!" notification
- If already in cart: Navigate to `/cart` page
- Button text changes to "View Cart" when item is in cart
- Disabled if product is out of stock

---

### 3. WishlistPage Component

**Location:** `frontend/src/pages/common/wishlist/WishlistPage.jsx`

**Purpose:** Main wishlist page showing all saved items

**Features:**
- Displays all wishlist items in a grid
- Empty state message when no items
- Remove individual items
- Add items to cart
- Loading and error states
- Authentication redirect if not logged in

**Route:** `/wishlist`

---

## 🔌 API Integration

### API Endpoints

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| GET | `/api/wishlist` | Get user's wishlist items | ✅ Yes |
| POST | `/api/wishlist/items` | Add product to wishlist | ✅ Yes |
| DELETE | `/api/wishlist/items/:productId` | Remove from wishlist | ✅ Yes |

### Request/Response Formats

**GET /api/wishlist**
```javascript
// Request: No body
Headers: { Cookie: session cookie }

// Response: 200 OK
{
  success: true,
  data: [
    {
      wishlist_id: "uuid",
      product_id: "uuid",
      product_name: "Product Name",
      product_slug: "product-slug",
      primary_image: "/path/to/image.jpg",
      category_name: "Category",
      price: "29.99",
      sale_price: "24.99",
      quantity_available: 10,
      is_active: true,
      created_at: "2025-12-29T..."
    }
  ]
}
```

**POST /api/wishlist/items**
```javascript
// Request
{
  productId: "product-uuid"
}

// Response: 201 Created
{
  success: true,
  message: "Item added to wishlist"
}

// Response: 409 Conflict (if already in wishlist)
{
  success: false,
  message: "Item already in wishlist"
}
```

**DELETE /api/wishlist/items/:productId**
```javascript
// Request: No body
// URL Param: productId

// Response: 200 OK
{
  success: true,
  message: "Item removed from wishlist"
}

// Response: 404 Not Found
{
  success: false,
  message: "Item not found in wishlist"
}
```

---

## 💾 Database Schema

### Wishlist Table

```sql
CREATE TABLE wishlist (
  wishlist_id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  product_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
  
  UNIQUE KEY unique_user_product (user_id, product_id)
);
```

**Key Points:**
- `user_id` and `product_id` combination must be unique
- Cascade delete when user or product is removed
- `created_at` timestamp for sorting/tracking

---

## 🔔 Event System

### Custom Events

**wishlistUpdated**
```javascript
window.dispatchEvent(new Event("wishlistUpdated"));
```

**Triggered By:**
- Adding item to wishlist (WishlistToggleBtn)
- Removing item from wishlist (WishlistToggleBtn, WishlistPage)

**Listened By:**
- WishlistBtn component (updates badge count)
- WishlistToggleBtn component (updates icon state)
- WishlistPage component (refreshes list)

**cartUpdated**
```javascript
window.dispatchEvent(new Event("cartUpdated"));
```

**Triggered By:**
- Adding to cart from WishlistItem

**Listened By:**
- CartBtn component (updates badge count)
- Cart page (refreshes data)

---

## 🎯 Integration with Shop System

### Cart Status Check

WishlistItem component checks if product is already in cart:

```javascript
useEffect(() => {
  const checkCartStatus = async () => {
    const response = await getCart();
    const cartItems = response.data?.items || [];
    const inCart = cartItems.some(item => item.product_id === product_id);
    setIsInCart(inCart);
  };
  checkCartStatus();
}, [product_id]);
```

### Badge Count Updates

**WishlistBtn Component:**
```javascript
// Polls wishlist count every 10 seconds
useEffect(() => {
  const interval = setInterval(fetchWishlistCount, 10000);
  window.addEventListener("wishlistUpdated", fetchWishlistCount);
  return () => {
    clearInterval(interval);
    window.removeEventListener("wishlistUpdated", fetchWishlistCount);
  };
}, [user]);
```

---

## 🔐 Authentication & Security

### Authentication Enforcement

**Frontend:**
```javascript
if (!user) {
  showNotification("error", "Please login to use wishlist", "error");
  return;
}
```

**Backend Middleware:**
```javascript
// All wishlist routes require authentication
router.use(requireAuth);
```

### Session Management

- Uses same session system as cart
- `withCredentials: true` on all requests
- Session validated on each API call

---

## 📱 User Experience Features

### Real-time Feedback
- **FadeNotification** appears immediately on action
- **Badge updates** within 1 second via event system
- **Icon state changes** instantly (filled/outlined heart)

### Loading States
- **Button disabled** during API calls
- **Pulse animation** on WishlistToggleBtn
- **Loading spinner** on page-level operations

### Error Handling
- **Network errors** show user-friendly messages
- **Duplicate adds** prevented with 409 Conflict response
- **Not found errors** handle gracefully

### Empty States
- **WishlistPage** shows message when empty
- **"Start adding items"** call-to-action
- **Link to shop page** for easy navigation

---

## 🧪 Testing Scenarios

### Functional Tests
1. ✅ Add product to wishlist → Heart icon fills, notification shows
2. ✅ Remove from wishlist → Heart icon outlines, notification shows
3. ✅ Wishlist badge updates after add/remove
4. ✅ Guest user sees login prompt when clicking heart
5. ✅ Duplicate add prevented (409 Conflict)
6. ✅ Add to cart from wishlist updates cart badge
7. ✅ "View Cart" button appears when item already in cart
8. ✅ Remove button on WishlistItem works correctly
9. ✅ Stock status displays correctly
10. ✅ Out of stock items disable "Add to Cart"

### Integration Tests
1. ✅ Wishlist persists across sessions
2. ✅ Deleted products removed from wishlist (cascade)
3. ✅ Multiple users can wishlist same product
4. ✅ Cart merge doesn't affect wishlist
5. ✅ Logout clears wishlist UI state

---

## 🔗 Related Documentation

- **[Shop & Cart Flow](../flows/shop-cart-flow.md)** - Complete shopping flow
- **[Authentication Flow](../flows/authentication-flow.md)** - Login/register system
- **[Notification System](./notification-system.md)** - FadeNotification component
- **[Shop API Reference](./shop-api-reference.md)** - All API endpoints

---

## 📝 Constants

**wishlistConstants.js:**
```javascript
export const WISHLIST_ENDPOINTS = {
  GET_WISHLIST: `${API_BASE}/api/wishlist`,
  ADD_TO_WISHLIST: `${API_BASE}/api/wishlist/items`,
  REMOVE_FROM_WISHLIST: (productId) => 
    `${API_BASE}/api/wishlist/items/${productId}`,
};

export const WISHLIST_SUCCESS_MESSAGES = {
  ITEM_ADDED: "Item added to wishlist",
  ITEM_REMOVED: "Item removed from wishlist",
};

export const WISHLIST_ERROR_MESSAGES = {
  FETCH_FAILED: "Failed to load wishlist",
  ADD_FAILED: "Failed to add item to wishlist",
  REMOVE_FAILED: "Failed to remove item from wishlist",
  ALREADY_EXISTS: "Item already in wishlist",
  NOT_FOUND: "Item not found in wishlist",
  LOGIN_REQUIRED: "Please login to use wishlist",
};
```

---

**Document Version:** 1.0  
**Last Updated:** December 29, 2025  
**Status:** ✅ Fully Implemented
