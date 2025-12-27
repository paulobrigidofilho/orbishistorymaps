# Shop Module Structure

This document outlines the complete structure of the shop module with cart, checkout, and payment functionality.

## Folder Structure

```
frontend/src/pages/shop/
├── components/
│   ├── ProductCard.jsx         # Individual product display in grid
│   ├── ProductCard.module.css
│   ├── ProductGrid.jsx         # Product grid layout
│   ├── ProductGrid.module.css
│   ├── CartItem.jsx            # Individual cart item display
│   └── CartItem.module.css
│
├── constants/
│   ├── shopConstants.js        # Shop-related constants (API endpoints, categories)
│   └── cartConstants.js        # Cart-related constants (payment methods, messages)
│
├── functions/
│   └── calculateCartTotal.js  # Calculate cart totals and item subtotals
│
├── services/
│   ├── productService.js       # Product API calls (getAll, getDetails)
│   ├── cartService.js          # Cart API calls (get, add, update, remove, clear)
│   └── orderService.js         # Order API calls (create, getById, getUserOrders)
│
├── validators/
│   ├── cartValidator.js        # Cart validation (quantity, checkout readiness)
│   └── checkoutValidator.js    # Checkout validation (address, payment method)
│
├── Shop.jsx                    # Main shop page with product grid
├── Shop.module.css
├── ProductDetail.jsx           # Product detail page with Add to Cart
├── ProductDetail.module.css
├── Cart.jsx                    # Shopping cart page
├── Cart.module.css
├── Checkout.jsx                # Checkout page with shipping address
├── Checkout.module.css
├── Payment.jsx                 # Payment method selection page
├── Payment.module.css
├── OrderConfirmation.jsx       # Order confirmation after successful checkout
└── OrderConfirmation.module.css
```

## Routes

The following routes have been registered in App.jsx:

- `/shop` - Browse products
- `/shop/product/:identifier` - Product detail page
- `/cart` - View shopping cart
- `/checkout` - Enter shipping address
- `/payment` - Select payment method
- `/order-confirmation` - Order confirmation page

## Cart Button

Updated `frontend/src/pages/common/btn/CartBtn.jsx` to link to `/cart` instead of `/shop`.

## Features Implemented

### Cart Page (Cart.jsx)

- Display all cart items with images and details
- Update quantity with +/- buttons
- Remove individual items
- Clear entire cart
- Calculate totals (subtotal, shipping, total)
- Proceed to checkout button
- Continue shopping button
- Responsive design

### Checkout Page (Checkout.jsx)

- Shipping address form
- Option to use saved address from profile
- Address validation
- Order summary sidebar
- Free shipping over $100
- Back to cart button
- Continue to payment button

### Payment Page (Payment.jsx)

- Payment method selection (credit card, debit card, PayPal, bank transfer)
- Demo mode notice
- Order summary with address and items
- Back to checkout button
- Place order button
- Order creation and cart clearing

### Order Confirmation Page (OrderConfirmation.jsx)

- Success message with checkmark
- Order number and date
- Order status badge
- Shipping address display
- Order items list with images
- Order summary (subtotal, shipping, tax, total)
- Payment method display
- Continue shopping and view orders buttons

## Validation

### Cart Validator (cartValidator.js)

- `validateQuantity()` - Validates quantity against stock
- `validateCartForCheckout()` - Ensures cart is ready for checkout

### Checkout Validator (checkoutValidator.js)

- `validateShippingAddress()` - Validates all address fields
- `validatePaymentMethod()` - Validates payment method selection

## Helper Functions

### Calculate Cart Total (calculateCartTotal.js)

- `calculateCartTotal()` - Calculates total price of all cart items
- `calculateItemSubtotal()` - Calculates subtotal for a single item

## Constants

### Shop Constants (shopConstants.js)

- API_BASE - Backend API base URL
- CATEGORIES - Product categories
- SORT_OPTIONS - Sorting options
- API endpoints

### Cart Constants (cartConstants.js)

- API_BASE - Backend API base URL
- CART_MESSAGES - User-facing messages
- PAYMENT_METHODS - Available payment methods
- ORDER_STATUS - Order status constants

## Services

### Product Service (productService.js)

- `getAllProducts()` - Get all products with filters
- `getProductDetails()` - Get single product details

### Cart Service (cartService.js)

- `getCart()` - Get user's cart
- `addToCart()` - Add item to cart
- `updateCartItem()` - Update item quantity
- `removeCartItem()` - Remove item from cart
- `clearCart()` - Clear entire cart

### Order Service (orderService.js)

- `createOrder()` - Create new order
- `getUserOrders()` - Get user's order history
- `getOrderById()` - Get specific order details

## Data Flow

1. **Browse Products**: User views products on Shop page
2. **Product Detail**: User clicks product to see details
3. **Add to Cart**: User adds item with quantity to cart
4. **View Cart**: User clicks cart button to see cart page
5. **Update Cart**: User can modify quantities or remove items
6. **Checkout**: User proceeds to checkout, enters shipping address
7. **Payment**: User selects payment method
8. **Place Order**: Order is created, cart is cleared
9. **Confirmation**: User sees order confirmation with details

## Session Storage Usage

The checkout flow uses session storage to pass data between pages:

- `checkoutAddress` - Shipping address from checkout page
- `checkoutCart` - Cart data from checkout page
- `lastOrderId` - Order ID for confirmation page (cleared after display)

## Backend Integration

All services use `withCredentials: true` for session-based authentication.

Backend endpoints used:

- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:id` - Update cart item
- `DELETE /api/cart/items/:id` - Remove cart item
- `DELETE /api/cart/:id` - Clear cart
- `GET /api/products` - Get all products
- `GET /api/products/:identifier` - Get product details
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order details

## Styling

All components use CSS Modules for scoped styling:

- Responsive design with mobile breakpoints
- Consistent color scheme
- Material Icons for UI elements
- Grid layouts for product display
- Flexbox for component layouts
