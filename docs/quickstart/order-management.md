///////////////////////////////////////////////////////////////////////
// ========== ORDER MANAGEMENT SYSTEM DOCUMENTATION ============== //
///////////////////////////////////////////////////////////////////////

/**
 * DOCUMENT PURPOSE:
 * Complete guide to the order management system including checkout,
 * payment processing, order creation, confirmation, and order history.
 * 
 * FEATURES: Checkout Flow, Payment, Order Creation, Confirmation, Order History
 * LAST UPDATED: December 29, 2025
 * VERSION: 1.0
 */

---

## 📋 Overview

The **Order Management System** handles the complete purchase workflow from checkout through confirmation and order history. Key features include:

- **Checkout Process** with shipping address collection
- **Payment Method Selection** with multiple options
- **Order Creation** with inventory management
- **Order Confirmation** with detailed receipt
- **Order History** with past purchase tracking
- **Email Notifications** (placeholder for future implementation)
- **Order Tracking** (basic status tracking)

---

## 🗂️ File Structure

### Frontend

```
frontend/src/pages/shop/
├── Checkout.jsx                    # Shipping address form
├── Checkout.module.css
│
├── Payment.jsx                     # Payment method selection
├── Payment.module.css
│
├── OrderConfirmation.jsx           # Order success page
├── OrderConfirmation.module.css
│
├── functions/
│   └── orderService/
│       ├── createOrder.js         # POST /api/orders
│       ├── getOrderById.js        # GET /api/orders/:id
│       └── getUserOrders.js       # GET /api/orders
│
├── validators/
│   └── checkoutValidator.js       # Address, payment validation
│
└── helpers/
    ├── calculateCartTotal.js      # Cart total calculation
    ├── calculateShipping.js       # Shipping fee calculation
    └── showMessage.js             # Notification helper
```

### Backend

```
backend/src/
├── controllers/
│   └── orderController.js          # Order HTTP handlers
│
├── services/
│   └── orderService.js             # Order business logic
│
├── model/
│   └── orderModel.js               # Order database operations
│
├── routes/
│   └── orderRoutes.js              # Order endpoints
│
└── validators/
    └── checkoutValidator.js        # Order input validation
```

---

## 🛒 Order Flow

### Step 1: Checkout Page

**Route:** `/checkout`
**Access:** Authenticated users only

**User Actions:**
1. Review cart items and totals
2. Enter shipping address:
   - Street address
   - City
   - State/Province
   - Postal code
   - Country (dropdown)
3. Option to use saved address from profile
4. Option to save address for future orders
5. Click "Continue to Payment"

**Address Validation:**
- All required fields must be filled
- Valid postal code format
- Country selection required
- Address length limits enforced

**Data Handled:**
```javascript
// Session storage backup
sessionStorage.setItem("checkoutAddress", JSON.stringify({
  street_address: "123 Main St",
  city: "Auckland",
  state: "Auckland",
  postal_code: "1010",
  country: "New Zealand"
}));
```

**Page Display:**
- Two-column layout (form + summary)
- Left: Address input form
- Right: Order summary sidebar
  - Item list with quantities
  - Subtotal
  - Shipping fee (calculated)
  - Tax (if applicable)
  - Total price
- Back to Cart button
- Continue to Payment button

### Step 2: Payment Page

**Route:** `/payment`
**Access:** Authenticated users who completed checkout

**Page Validation:**
1. Check session has checkoutAddress
2. Check session has checkoutCart
3. Verify user is authenticated
4. Load checkout data from session

**Payment Methods Available:**
```javascript
{
  "credit_card": {
    label: "Credit/Debit Card",
    icon: "payment",
    description: "Visa, Mastercard, American Express"
  },
  "paypal": {
    label: "PayPal",
    icon: "paypal",
    description: "Pay securely with PayPal"
  },
  "bank_transfer": {
    label: "Bank Transfer",
    icon: "account_balance",
    description: "Direct bank transfer"
  }
}
```

**User Actions:**
1. Review order summary
2. Review shipping address
3. Select payment method (required)
4. Accept terms & conditions (checkbox)
5. Click "Place Order"

**Demo Mode:**
- "This is a demo. No actual payment processed."
- All payment methods are simulated
- Order is created regardless of method selected

**Processing:**
1. Validate payment method selected
2. Create order in database
3. Add items to order from cart
4. Clear shopping cart
5. Store order ID in session
6. Redirect to confirmation page

### Step 3: Order Confirmation

**Route:** `/order-confirmation`
**Auto-load:** Loads from session storage (`lastOrderId`)

**Display Information:**
- Success message with checkmark icon
- Order number (for customer reference)
- Order date and time
- Order status badge (pending, processing, shipped)
- Estimated delivery date (if applicable)
- Shipping address (formatted)
- Order items:
  - Product image
  - Product name (clickable to product)
  - Quantity
  - Unit price
  - Item subtotal
- Order summary:
  - Subtotal
  - Shipping cost
  - Tax
  - **Total**
- Payment method display
- Email confirmation notice
- Confirmation email sent message

**User Actions:**
- "Continue Shopping" button (→ /shop)
- "View All Orders" button (→ /my-orders)
- Print order (optional)
- Share order (optional)

**Auto-Clear:**
- Session clears lastOrderId after loading
- User can't access confirmation twice

---

## 🔌 API Endpoints

### POST /api/orders

**Purpose:** Create new order from cart

**Authentication:** Required

**Request Body:**
```javascript
{
  shipping_address: {
    street_address: "123 Main St",
    city: "Auckland",
    state: "Auckland",
    postal_code: "1010",
    country: "New Zealand"
  },
  payment_method: "credit_card"  // or "paypal", "bank_transfer"
}
```

**Processing:**
1. Validate shipping address
2. Validate payment method
3. Get user's current cart
4. Create order record
5. Copy cart items to order items
6. Calculate totals (subtotal, shipping, tax)
7. Clear user's cart
8. Return created order

**Success Response (201):**
```javascript
{
  success: true,
  message: "Order created successfully",
  data: {
    order_id: "uuid",
    order_number: "ORD-20250120-001234",
    user_id: "user-uuid",
    status: "pending",
    shipping_address: { /* address object */ },
    items: [
      {
        order_item_id: "id",
        product_id: "prod-id",
        product_name: "Product Name",
        quantity: 2,
        price: "99.99",
        subtotal: "199.98"
      }
    ],
    subtotal: "249.95",
    shipping: "10.00",
    tax: "25.00",
    total: "284.95",
    payment_method: "credit_card",
    created_at: "2025-01-20T14:22:00.000Z",
    updated_at: "2025-01-20T14:22:00.000Z"
  }
}
```

**Error Response (400):**
```javascript
{
  success: false,
  message: "Shipping address is required"
}
```

**Error Response (401):**
```javascript
{
  success: false,
  message: "Authentication required"
}
```

---

### GET /api/orders

**Purpose:** Get user's order history

**Authentication:** Required

**Query Parameters:**
```javascript
{
  limit: 10,        // Items per page
  offset: 0,        // Pagination offset
  status: null      // Filter by status (optional)
}
```

**Success Response (200):**
```javascript
{
  success: true,
  message: "Orders retrieved successfully",
  data: [
    {
      order_id: "uuid",
      order_number: "ORD-20250120-001",
      status: "pending",
      total: "284.95",
      item_count: 3,
      created_at: "2025-01-20T14:22:00.000Z"
    },
    {
      order_id: "uuid",
      order_number: "ORD-20250115-002",
      status: "shipped",
      total: "149.99",
      item_count: 1,
      created_at: "2025-01-15T10:30:00.000Z"
    }
  ],
  pagination: {
    limit: 10,
    offset: 0,
    total: 15
  }
}
```

---

### GET /api/orders/:orderId

**Purpose:** Get detailed order information

**Authentication:** Required (user can only access own orders)

**Success Response (200):**
```javascript
{
  success: true,
  message: "Order details retrieved successfully",
  data: {
    order_id: "uuid",
    order_number: "ORD-20250120-001234",
    user_id: "user-uuid",
    status: "pending",
    shipping_address: {
      street_address: "123 Main St",
      city: "Auckland",
      state: "Auckland",
      postal_code: "1010",
      country: "New Zealand"
    },
    items: [
      {
        order_item_id: "id",
        product_id: "prod-id",
        product_name: "Product Name",
        quantity: 2,
        price: "99.99",
        subtotal: "199.98",
        primary_image: "path/to/image.jpg"
      }
    ],
    subtotal: "249.95",
    shipping: "10.00",
    tax: "25.00",
    total: "284.95",
    payment_method: "credit_card",
    created_at: "2025-01-20T14:22:00.000Z",
    updated_at: "2025-01-20T14:22:00.000Z"
  }
}
```

**Error Response (404):**
```javascript
{
  success: false,
  message: "Order not found"
}
```

**Error Response (403):**
```javascript
{
  success: false,
  message: "You do not have permission to view this order"
}
```

---

## 💾 Database Schema

### Orders Table

```sql
CREATE TABLE orders (
  order_id VARCHAR(36) PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  shipping_address JSON NOT NULL,
  payment_method VARCHAR(50),
  subtotal DECIMAL(10,2) NOT NULL,
  shipping DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2),
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE RESTRICT,
  KEY idx_user_id (user_id),
  KEY idx_order_number (order_number),
  KEY idx_status (status),
  KEY idx_created_at (created_at)
);
```

**Fields:**
- `order_id` - Unique identifier
- `order_number` - Human-readable order number (ORD-YYYYMMDD-XXXX)
- `user_id` - Reference to user who placed order
- `status` - Order status (pending, processing, shipped, delivered, cancelled)
- `shipping_address` - JSON blob of address data
- `payment_method` - Method used (credit_card, paypal, bank_transfer)
- `subtotal` - Sum of item prices
- `shipping` - Shipping cost
- `tax` - Tax amount
- `total` - Total amount charged

---

### Order Items Table

```sql
CREATE TABLE order_items (
  order_item_id VARCHAR(36) PRIMARY KEY,
  order_id VARCHAR(36) NOT NULL,
  product_id VARCHAR(36) NOT NULL,
  product_name VARCHAR(255),
  quantity INT NOT NULL CHECK (quantity > 0),
  price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  
  FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(product_id),
  KEY idx_order_id (order_id)
);
```

**Fields:**
- `order_item_id` - Unique identifier
- `order_id` - Reference to order
- `product_id` - Reference to product
- `product_name` - Product name snapshot (for history)
- `quantity` - How many ordered
- `price` - Price at time of order
- `subtotal` - quantity × price

---

## 📱 Order Status

### Status Values

```javascript
const ORDER_STATUS = {
  PENDING: "pending",        // Just created, awaiting processing
  PROCESSING: "processing",  // Being prepared for shipment
  SHIPPED: "shipped",        // Sent to customer
  DELIVERED: "delivered",    // Received by customer
  CANCELLED: "cancelled"     // Order cancelled
};
```

### Status Transitions

```
PENDING → PROCESSING → SHIPPED → DELIVERED
         ↓
      CANCELLED
```

---

## 🔐 Security Features

### Order Access Control

**User Can Only:**
- View own orders
- GET /api/orders (own orders only)
- GET /api/orders/:orderId (only if user_id matches)

**Backend Validation:**
```javascript
// Every order request validates:
1. User is authenticated (req.session.user)
2. Order belongs to user (order.user_id === req.session.user.id)
3. User has permission
```

### Payment Security

**Sensitive Data:**
- Credit card numbers NOT stored
- Payment methods are references only
- Actual payment processing delegated to payment gateway
- No sensitive data in logs

**Demo Mode:**
- All payments simulated (no real charge)
- Order created regardless of selection
- Suitable for testing/development

---

## 💰 Pricing Calculations

### Subtotal
```javascript
subtotal = sum(item.price * item.quantity for each item)
```

### Shipping
```javascript
if (subtotal > $100) {
  shipping = $0  // Free shipping
} else {
  shipping = $10 // Flat $10 rate
}
```

### Tax (Optional)
```javascript
// Currently no tax calculation
// Ready for future tax system implementation
tax = 0
```

### Total
```javascript
total = subtotal + shipping + tax
```

---

## 📱 User Experience Features

### Checkout Experience

**Visual Feedback:**
- Two-column layout (form + summary)
- Real-time order total calculation
- Shipping cost displays immediately
- Address validation feedback
- Clear error messages

**Saved Addresses:**
- Users can save addresses from profile
- Quick select from saved addresses
- Option to save new address for future
- Edit address before order

**Session Persistence:**
- Order data saved in session storage
- Survives page refresh
- Allows going back/forward between checkout pages
- Auto-clears after order completion

### Confirmation Experience

**Success Display:**
- Large checkmark icon
- "Order Successful" message
- Order number for reference
- Email confirmation notice
- Complete order details
- Next steps (continue shopping, view orders)

**Order Information:**
- Professional receipt format
- Easy-to-read item list
- Clear address display
- Total breakdown
- Payment method display

---

## 🧪 Testing Checklist

### Checkout Flow
- [ ] Navigate to cart with items
- [ ] Click "Proceed to Checkout"
- [ ] Redirected to checkout page
- [ ] Address form displays
- [ ] Can use saved address
- [ ] Can enter new address
- [ ] Validation works (required fields)
- [ ] Order summary displays correctly
- [ ] Subtotal calculates correctly
- [ ] Shipping fee calculates correctly
- [ ] Total displays correctly
- [ ] "Back to Cart" works
- [ ] "Continue to Payment" works

### Payment Flow
- [ ] Payment page loads
- [ ] Checkout data loaded from session
- [ ] Address displays correctly
- [ ] Cart items display correctly
- [ ] Order total displays correctly
- [ ] Payment method selection works
- [ ] Can select each payment method
- [ ] Terms checkbox works
- [ ] "Back to Checkout" works
- [ ] "Place Order" submits

### Order Creation
- [ ] Order created successfully
- [ ] Order number generated
- [ ] Order status is "pending"
- [ ] Cart cleared after order
- [ ] Order stored in database
- [ ] Order items stored
- [ ] Total amounts correct
- [ ] Address saved correctly

### Order Confirmation
- [ ] Confirmation page loads
- [ ] Order number displays
- [ ] Order date displays
- [ ] Status badge displays
- [ ] Shipping address displays
- [ ] Order items display
- [ ] Product images display
- [ ] Prices correct
- [ ] Totals correct
- [ ] Payment method displays
- [ ] Email confirmation message shows
- [ ] "Continue Shopping" works
- [ ] "View All Orders" works
- [ ] Session clears lastOrderId

### Order History
- [ ] Access /my-orders (future)
- [ ] List of past orders displays
- [ ] Each order shows key info
- [ ] Can click to view details
- [ ] Order details page loads
- [ ] Complete order info displays
- [ ] Pagination works if many orders
- [ ] Can't view other users' orders

### Security
- [ ] Non-authenticated users can't checkout
- [ ] Non-authenticated users can't pay
- [ ] Users can only see own orders
- [ ] Order validation works
- [ ] Address validation enforced
- [ ] Payment method validated

---

## 🔗 Related Documentation

- **[Shop & Cart Flow](../flows/shop-cart-flow.md)** - Complete shopping flow
- **[Shop Structure](./shop-structure.md)** - Shop module details
- **[Notification System](./notification-system.md)** - Feedback system
- **[Authentication](./authentication.md)** - User authentication
- **[Sitemap](../sitemap.md)** - Documentation index

---

## 📝 Future Enhancements

- [ ] Email order confirmation
- [ ] SMS order updates
- [ ] Order tracking with tracking numbers
- [ ] Estimated delivery dates
- [ ] Order cancellation
- [ ] Order modifications
- [ ] Return/refund system
- [ ] Real payment gateway integration
- [ ] Tax calculation system
- [ ] Invoice generation/download
- [ ] Order notifications (email, SMS)
- [ ] Admin order management
- [ ] Inventory synchronization

---

**Document Version:** 1.0  
**Last Updated:** December 29, 2025  
**Status:** ✅ Core Features Implemented
