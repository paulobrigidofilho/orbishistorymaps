///////////////////////////////////////////////////////////////////////
// ==================== SHOP MODULE DOCUMENTATION ==================== //
///////////////////////////////////////////////////////////////////////

/**
 * DOCUMENT PURPOSE:
 * Complete guide to the shop module including product browsing, shopping cart,
 * checkout process, order management, and all related components and services.
 * 
 * FEATURES: Product Catalog, Shopping Cart, Checkout, Orders, Wishlists Integration
 * LAST UPDATED: December 29, 2025
 * VERSION: 1.0
 */

---

## 📋 Overview

The **Shop Module** is the core e-commerce system for the Orbis platform. It provides:

- **Product Catalog** with filtering, search, and sorting
- **Product Detail Pages** with images, descriptions, and reviews
- **Shopping Cart** (guest and authenticated users)
- **Checkout Process** with shipping address and payment
- **Order Management** with history and confirmation
- **Wishlist Integration** for saving products
- **Real-time Updates** with notifications and badges

---

## 🗂️ File Structure

### Frontend

```
frontend/src/pages/shop/
├── Shop.jsx                        # Main shop page (product catalog)
├── Shop.module.css
│
├── ProductDetail.jsx               # Product detail page
├── ProductDetail.module.css
│
├── Cart.jsx                        # Shopping cart page
├── Cart.module.css
│
├── Checkout.jsx                    # Checkout (shipping address)
├── Checkout.module.css
│
├── Payment.jsx                     # Payment method selection
├── Payment.module.css
│
├── OrderConfirmation.jsx           # Order confirmation page
├── OrderConfirmation.module.css
│
├── btn/
│   ├── AddToCartBtn.jsx            # Add to cart button
│   ├── ProceedToCheckoutBtn.jsx    # Proceed to checkout button
│   ├── QuantitySelector.jsx        # Quantity +/- selector
│   ├── ContinueShoppingBtn.jsx     # Continue shopping button
│   └── ShopButtons.module.css
│
├── components/
│   ├── ProductCard.jsx             # Single product card in grid
│   ├── ProductCard.module.css
│   ├── ProductGrid.jsx             # Product grid container
│   ├── ProductGrid.module.css
│   ├── CartItem.jsx                # Single cart item
│   └── CartItem.module.css
│
├── constants/
│   ├── shopConstants.js            # Shop API endpoints, categories
│   └── cartConstants.js            # Cart constants, messages, payment methods
│
├── functions/
│   ├── cartService/
│   │   ├── fetchCart.js            # GET /api/cart
│   │   ├── handleAddToCart.js      # POST /api/cart/items
│   │   ├── handleUpdateQuantity.js # PUT /api/cart/items/:id
│   │   ├── handleRemoveItem.js     # DELETE /api/cart/items/:id
│   │   └── handleClearCart.js      # DELETE /api/cart
│   │
│   ├── orderService/
│   │   ├── createOrder.js          # POST /api/orders
│   │   ├── fetchOrders.js          # GET /api/orders
│   │   └── fetchOrderById.js       # GET /api/orders/:id
│   │
│   └── productService/
│       ├── getAllProducts.js       # GET /api/products
│       └── getProductDetails.js    # GET /api/products/:identifier
│
├── helpers/
│   ├── calculateCartTotal.js       # Calculate cart totals
│   ├── calculateShipping.js        # Calculate shipping fees
│   ├── handleQuantityChange.js     # Quantity change logic
│   └── formatPrice.js              # Price formatting utility
│
└── validators/
    ├── cartValidator.js            # Cart validation (quantity, checkout)
    ├── checkoutValidator.js        # Address validation
    └── productValidator.js         # Product data validation
```

### Backend

```
backend/src/
├── controllers/
│   ├── cartController.js           # Cart HTTP handlers
│   ├── orderController.js          # Order HTTP handlers
│   └── productController.js        # Product HTTP handlers
│
├── services/
│   ├── cartService.js              # Cart business logic
│   ├── orderService.js             # Order business logic
│   └── productService.js           # Product business logic
│
├── model/
│   ├── cartModel.js                # Cart database operations
│   ├── orderModel.js               # Order database operations
│   ├── productModel.js             # Product database operations
│   └── inventoryModel.js           # Inventory tracking
│
├── routes/
│   ├── cartRoutes.js               # Cart endpoints
│   ├── orderRoutes.js              # Order endpoints
│   └── productRoutes.js            # Product endpoints
│
├── middleware/
│   ├── authMiddleware.js           # Authentication check
│   └── cartMiddleware.js           # Cart validation
│
└── validators/
    └── shopValidator.js            # Input validation
```

---

## 🛍️ Shop Pages & Routes

### Shop Page (Catalog)

**Location:** `frontend/src/pages/shop/Shop.jsx`
**Route:** `/shop`

**Features:**
- Product grid display with cards
- Filter by category
- Search by product name
- Price range filter
- Sort by (popularity, price, newest, rating)
- Pagination (20 products per page)
- Loading state with skeleton loaders
- Error handling with retry button

**Components Used:**
- `ProductGrid` - Main grid container
- `ProductCard` - Individual product card (clickable)
- Filters sidebar
- Sort dropdown

**Data Fetched:**
```javascript
getAllProducts({
  category: null,      // Filter by category
  minPrice: null,      // Minimum price filter
  maxPrice: null,      // Maximum price filter
  search: "",          // Search query
  featured: false,     // Show featured only
  page: 1,             // Pagination
  limit: 20            // Items per page
})
```

### Product Detail Page

**Location:** `frontend/src/pages/shop/ProductDetail.jsx`
**Route:** `/shop/product/:identifier`
**Identifier:** Product ID or slug (either works)

**Features:**
- Large product image gallery
- Product name, brand, description
- Price (with sale price if available)
- Stock status indicator
- Rating and review summary
- Quantity selector (1-99)
- "Add to Cart" button
- "Proceed to Checkout" button (shows after add)
- "Add to Wishlist" toggle button
- Related products carousel
- FadeNotification for feedback

**Components Used:**
- `WishlistToggleBtn` - Heart icon for wishlist
- `QuantitySelector` - Quantity +/- controls
- `AddToCartBtn` - Add to cart action
- `ProceedToCheckoutBtn` - Direct checkout
- `FadeNotification` - User feedback
- Image gallery/carousel

**Data Fetched:**
```javascript
getProductDetails(identifier)  // Gets full product details
```

**Stock Status Display:**
| Stock Level | Display | Color |
|------------|---------|-------|
| > 20 units | "In Stock" | Green |
| 5-20 units | "Low Stock" | Orange |
| 1-4 units | "Only X left" | Red |
| 0 units | "Out of Stock" | Gray |

### Shopping Cart Page

**Location:** `frontend/src/pages/shop/Cart.jsx`
**Route:** `/cart`

**Features:**
- Display all cart items in list/grid
- Product image, name, price, quantity
- Quantity selector for each item
- Remove individual items
- Edit item details
- Clear entire cart button
- Order summary:
  - Subtotal
  - Shipping cost (calculated based on total)
  - Tax (if applicable)
  - Total price
- "Proceed to Checkout" button
- "Continue Shopping" button
- Empty cart state with link to shop
- FadeNotification for changes

**Cart Item Component:**
- Product image with fallback
- Product name (clickable to detail)
- Product price (with original price strikethrough)
- Quantity selector (update on change)
- Remove button (with confirmation)
- Item subtotal

**Shipping Calculation:**
```javascript
// Free shipping over $100
if (subtotal >= 100) {
  shipping = 0;
} else {
  shipping = 10;  // Flat $10 shipping
}
```

**Data Fetched:**
```javascript
fetchCart()  // Gets current cart for user/guest
```

### Checkout Page

**Location:** `frontend/src/pages/shop/Checkout.jsx`
**Route:** `/checkout`

**Features:**
- Shipping address form:
  - First name, Last name
  - Address line 1, Address line 2 (optional)
  - City, State/Province
  - Postal code
  - Country (dropdown)
  - Phone number
- Option to use saved address from profile
- Option to save address for future orders
- Address validation
- Order summary sidebar:
  - Item list with quantities
  - Subtotal
  - Shipping fee
  - Tax
  - Total
- "Back to Cart" button
- "Continue to Payment" button
- FadeNotification for errors

**Form Validation:**
- All required fields must be filled
- Phone number format validation
- Postal code format (depends on country)
- Address length limits

**Data Handling:**
```javascript
// Session storage for checkout data
sessionStorage.setItem("checkoutAddress", JSON.stringify(address));
sessionStorage.setItem("checkoutCart", JSON.stringify(cartItems));
```

### Payment Page

**Location:** `frontend/src/pages/shop/Payment.jsx`
**Route:** `/payment`

**Features:**
- Payment method selection:
  - Credit/Debit Card
  - PayPal
  - Bank Transfer
  - Apple Pay / Google Pay (optional)
- Demo mode notice
- Order review:
  - Shipping address display
  - Cart items display
  - Price summary
- "Back to Checkout" button
- "Place Order" button
- Terms & Conditions checkbox
- FadeNotification for processing

**Payment Methods:**
```javascript
{
  "credit_card": { label: "Credit/Debit Card", icon: "payment" },
  "paypal": { label: "PayPal", icon: "paypal" },
  "bank_transfer": { label: "Bank Transfer", icon: "account_balance" }
}
```

**Order Creation Flow:**
1. User clicks "Place Order"
2. Creates order record in database
3. Clears shopping cart
4. Redirects to confirmation page
5. Stores order ID in session

### Order Confirmation Page

**Location:** `frontend/src/pages/shop/OrderConfirmation.jsx`
**Route:** `/order-confirmation`

**Features:**
- Success message with checkmark icon
- Order number (for reference)
- Order date and time
- Order status badge (pending, processing, shipped)
- Shipping address display
- Order items list with:
  - Product images
  - Product names (clickable)
  - Quantities
  - Unit prices
  - Item subtotals
- Order summary:
  - Subtotal
  - Shipping
  - Tax
  - Total
- Payment method display
- Expected delivery date (if applicable)
- "Continue Shopping" button
- "View All Orders" button
- Email confirmation notice

**Data Fetched:**
```javascript
// From order service
const order = await fetchOrderById(orderId);
```

---

## 🎨 Components

### ProductCard Component

**Location:** `frontend/src/pages/shop/components/ProductCard.jsx`

**Props:**
```typescript
{
  product: Product;              // Product data object
  onAddToCart?: () => void;      // Add to cart callback
  onViewDetails?: () => void;    // View details callback
}
```

**Features:**
- Product image with fallback
- Product name (max 50 chars with ellipsis)
- Category badge
- Rating (stars) if available
- Price display with sale price strikethrough
- Stock status indicator
- Quick "Add to Cart" button
- Clickable for product detail view
- Hover effects
- Responsive design

**Product Data Structure:**
```javascript
{
  product_id: "uuid",
  product_name: "Product Name",
  product_slug: "product-slug",
  category_name: "Category",
  price: "99.99",
  sale_price: "79.99",
  primary_image: "path/to/image.jpg",
  quantity_available: 50,
  is_active: true,
  rating_average: 4.5,
  rating_count: 28
}
```

### ProductGrid Component

**Location:** `frontend/src/pages/shop/components/ProductGrid.jsx`

**Props:**
```typescript
{
  products: Product[];           // Array of products
  loading: boolean;              // Loading state
  error?: string;                // Error message
  onRetry?: () => void;          // Retry callback
}
```

**Features:**
- Responsive grid (4 columns desktop, 2 mobile)
- Skeleton loaders while loading
- Error state with retry button
- Empty state when no products
- Pagination controls

### CartItem Component

**Location:** `frontend/src/pages/shop/components/CartItem.jsx`

**Props:**
```typescript
{
  item: CartItem;                // Cart item data
  onQuantityChange: (qty: number) => void;
  onRemove: () => void;          // Remove item callback
  updating?: boolean;            // Loading state
}
```

**Features:**
- Product image (clickable to detail)
- Product name and sku
- Price with original strikethrough
- Quantity selector with +/- buttons
- Remove button
- Item subtotal
- FadeNotification on update
- Stock validation

---

## 🔌 API Endpoints

### Product Endpoints

**GET /api/products**
```javascript
// Query Parameters:
{
  page: 1,              // Page number
  limit: 20,            // Items per page
  search: "",           // Search term
  category: null,       // Category filter
  minPrice: null,       // Min price filter
  maxPrice: null,       // Max price filter
  sort: "created_at",   // Sort field
  order: "desc"         // Sort order (asc/desc)
}

// Response:
{
  success: true,
  data: [
    {
      product_id: "uuid",
      product_name: "Product Name",
      product_slug: "product-slug",
      category_name: "Category",
      price: "99.99",
      sale_price: "79.99",
      primary_image: "path/to/image.jpg",
      quantity_available: 50,
      is_active: true,
      rating_average: 4.5,
      rating_count: 28
    }
  ],
  pagination: {
    page: 1,
    limit: 20,
    total: 245,
    totalPages: 13
  }
}
```

**GET /api/products/:identifier**
```javascript
// Identifier: Product ID or slug

// Response:
{
  success: true,
  data: {
    product_id: "uuid",
    product_name: "Product Name",
    product_description: "Detailed description...",
    product_slug: "product-slug",
    category_id: "cat-uuid",
    category_name: "Category",
    brand: "Brand Name",
    price: "99.99",
    sale_price: "79.99",
    sku: "PROD-001",
    quantity_available: 50,
    is_active: true,
    is_featured: false,
    images: [
      { image_id: "id", image_url: "path" }
    ],
    tags: [
      { tag_id: "id", tag_name: "tag" }
    ],
    rating_average: 4.5,
    rating_count: 28,
    view_count: 150,
    created_at: "2025-01-15T10:30:00.000Z"
  }
}
```

### Cart Endpoints

**GET /api/cart**
```javascript
// Authentication: Required
// Headers: Cookie session

// Response:
{
  success: true,
  data: {
    cart_id: "uuid",
    user_id: "uuid",
    session_id: "session-id",
    items: [
      {
        cart_item_id: "id",
        product_id: "prod-id",
        product_name: "Product",
        price: "99.99",
        sale_price: "79.99",
        quantity: 2,
        primary_image: "path"
      }
    ],
    item_count: 5,
    subtotal: "249.95",
    created_at: "2025-01-15T10:30:00.000Z",
    updated_at: "2025-01-20T14:22:00.000Z"
  }
}
```

**POST /api/cart/items**
```javascript
// Authentication: Required (guest via session)
// Request Body:
{
  product_id: "product-uuid",
  quantity: 2
}

// Response: 201 Created
{
  success: true,
  message: "Item added to cart",
  data: { /* updated cart */ }
}
```

**PUT /api/cart/items/:cartItemId**
```javascript
// Authentication: Required
// Request Body:
{
  quantity: 3
}

// Response:
{
  success: true,
  message: "Cart item updated",
  data: { /* updated cart */ }
}
```

**DELETE /api/cart/items/:cartItemId**
```javascript
// Authentication: Required
// Response:
{
  success: true,
  message: "Item removed from cart",
  data: { /* updated cart */ }
}
```

**DELETE /api/cart**
```javascript
// Authentication: Required
// Clears entire cart
// Response:
{
  success: true,
  message: "Cart cleared successfully",
  data: { items: [] }
}
```

### Order Endpoints

**POST /api/orders**
```javascript
// Authentication: Required
// Request Body:
{
  shipping_address: {
    first_name: "John",
    last_name: "Doe",
    address_line1: "123 Main St",
    address_line2: "Apt 4",
    city: "Auckland",
    state: "Auckland",
    postal_code: "1010",
    country: "New Zealand",
    phone_number: "021234567"
  },
  payment_method: "credit_card",
  save_address: true
}

// Response: 201 Created
{
  success: true,
  message: "Order created successfully",
  data: {
    order_id: "uuid",
    order_number: "ORD-20250120-001",
    user_id: "user-uuid",
    status: "pending",
    shipping_address: { /* address object */ },
    items: [ /* cart items */ ],
    subtotal: "249.95",
    shipping: "10.00",
    tax: "24.99",
    total: "284.94",
    payment_method: "credit_card",
    created_at: "2025-01-20T14:22:00.000Z"
  }
}
```

**GET /api/orders**
```javascript
// Authentication: Required
// Query:
{
  page: 1,
  limit: 10,
  status: null  // Filter by status
}

// Response:
{
  success: true,
  data: [ /* array of orders */ ],
  pagination: { /* pagination info */ }
}
```

**GET /api/orders/:orderId**
```javascript
// Authentication: Required
// Response:
{
  success: true,
  data: { /* complete order with items */ }
}
```

---

## 💾 Database Schema

### Products Table

```sql
CREATE TABLE products (
  product_id VARCHAR(36) PRIMARY KEY,
  product_name VARCHAR(255) NOT NULL,
  product_description TEXT,
  product_slug VARCHAR(255) UNIQUE,
  category_id VARCHAR(36),
  brand VARCHAR(100),
  price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2),
  sku VARCHAR(50) UNIQUE NOT NULL,
  quantity_available INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  view_count INT DEFAULT 0,
  rating_average DECIMAL(3,2),
  rating_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (category_id) REFERENCES categories(category_id),
  KEY idx_slug (product_slug),
  KEY idx_sku (sku)
);
```

### Cart Table

```sql
CREATE TABLE cart (
  cart_id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36),
  session_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  KEY idx_user_id (user_id),
  KEY idx_session_id (session_id),
  CONSTRAINT check_auth CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);
```

### Cart Items Table

```sql
CREATE TABLE cart_items (
  cart_item_id VARCHAR(36) PRIMARY KEY,
  cart_id VARCHAR(36) NOT NULL,
  product_id VARCHAR(36) NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (cart_id) REFERENCES cart(cart_id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
  KEY idx_cart_id (cart_id),
  UNIQUE KEY unique_cart_product (cart_id, product_id)
);
```

### Orders Table

```sql
CREATE TABLE orders (
  order_id VARCHAR(36) PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  shipping_address JSON,
  payment_method VARCHAR(50),
  subtotal DECIMAL(10,2),
  shipping DECIMAL(10,2),
  tax DECIMAL(10,2),
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE RESTRICT,
  KEY idx_user_id (user_id),
  KEY idx_order_number (order_number),
  KEY idx_status (status)
);
```

### Order Items Table

```sql
CREATE TABLE order_items (
  order_item_id VARCHAR(36) PRIMARY KEY,
  order_id VARCHAR(36) NOT NULL,
  product_id VARCHAR(36) NOT NULL,
  product_name VARCHAR(255),
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2),
  subtotal DECIMAL(10,2),
  
  FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(product_id),
  KEY idx_order_id (order_id)
);
```

---

## 🔐 Authentication & Authorization

### Cart Access Control

**Guest Users:**
- Cart identified by `session_id`
- Cart data stored in session
- Products added to cart with session ID
- Cart persists until session expires

**Authenticated Users:**
- Cart identified by `user_id`
- Cart data synced across devices
- Can access from multiple sessions
- Cart persists across login/logout

**Cart Merge on Login:**
When guest logs in with items in cart:
1. Guest cart found via `session_id`
2. Items copied to user's cart
3. Guest cart marked as obsolete
4. User cart updated with all items
5. Badge and UI refresh

### Order Access Control

**Creating Orders:**
- User must be authenticated
- User_id automatically added to order
- Cart must belong to user
- User can only view/access own orders

**Viewing Orders:**
- Users can only see their own orders
- Admin can see all orders
- Backend validates user_id on every request

---

## 📱 User Experience Features

### Loading States
- Skeleton loaders on product cards
- Spinner on buttons during action
- Page loading indicators

### Feedback & Notifications
- FadeNotification on add to cart
- FadeNotification on quantity update
- Success messages for completed actions
- Error messages with retry options

### Error Handling
- Network error recovery
- Out of stock handling
- Invalid product handling
- Empty cart states
- Session timeout handling

### Responsive Design
- Desktop: 4-column product grid
- Tablet: 2-column grid
- Mobile: 1-column with larger cards
- Touch-friendly buttons
- Horizontal scroll on mobile for wide content

---

## 🧪 Testing Checklist

- [ ] Browse products on shop page
- [ ] Filter products by category
- [ ] Search for products by name
- [ ] Sort products (price, name, rating)
- [ ] View product details
- [ ] Add product to cart from detail page
- [ ] Add to cart notification appears
- [ ] Cart badge updates
- [ ] Add to wishlist from detail page
- [ ] View cart page
- [ ] Update quantity in cart
- [ ] Remove item from cart
- [ ] Clear entire cart
- [ ] Cart totals calculate correctly
- [ ] Proceed to checkout as guest
- [ ] Login modal appears for guest
- [ ] Proceed to checkout as authenticated user
- [ ] Enter shipping address
- [ ] Validate address fields
- [ ] View order summary on checkout
- [ ] Select payment method
- [ ] Place order successfully
- [ ] See order confirmation
- [ ] Order number is generated
- [ ] View order history
- [ ] View specific order details

---

## 🔗 Related Documentation

- **[Shop & Cart Flow](../flows/shop-cart-flow.md)** - Complete flow diagrams
- **[Wishlist System](./wishlist-system.md)** - Wishlist integration
- **[Notification System](./notification-system.md)** - FadeNotification usage
- **[Shop & Cart Flow Chart](../charts/shop-cart-flow-chart.md)** - Visual charts
- **[Sitemap](../sitemap.md)** - Documentation index

---

**Document Version:** 1.0  
**Last Updated:** December 29, 2025  
**Status:** ✅ Fully Implemented
