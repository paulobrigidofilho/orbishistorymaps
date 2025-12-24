# Shop & Cart Flow

This document describes the planned e-commerce functionality including product browsing, cart management, and checkout process.

**Status:** 🔄 Planned Feature

---

## Flow Diagram

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#D4AF37','primaryTextColor':'#000','primaryBorderColor':'#000','lineColor':'#D4AF37','secondaryColor':'#1a1a1a','tertiaryColor':'#333'}}}%%
graph TD
    Shop[Shop Page]:::gold --> Browse[Browse Products]:::black
    
    Browse --> Filter[Filter/Sort]:::gold
    Filter --> ProductCard[Product Card]:::black
    
    ProductCard --> QuickAdd[Quick Add]:::black
    ProductCard --> ViewDetails[View Details]:::black
    
    ViewDetails --> ProductPage[Product Page]:::gold
    ProductPage --> AddToCart[Add to Cart]:::black
    
    QuickAdd --> CartUpdate[Update Cart]:::gold
    AddToCart --> CartUpdate
    
    CartUpdate --> CartIcon[Cart Badge]:::gold
    
    CartIcon --> CartView[View Cart]:::black
    CartView --> UpdateQty[Update Qty]:::black
    CartView --> Remove[Remove Item]:::black
    
    CartView --> ProceedCheckout[Proceed to Checkout]:::gold
    ProceedCheckout --> AuthCheck{Logged In?}:::gold
    
    AuthCheck -->|No| LoginPrompt[Login Required]:::error
    AuthCheck -->|Yes| CheckoutPage[Checkout]:::black
    
    LoginPrompt --> Login[Login/Register]:::gold
    Login --> CheckoutPage
    
    CheckoutPage --> ShippingInfo[Shipping]:::black
    CheckoutPage --> BillingInfo[Billing]:::black
    CheckoutPage --> OrderSummary[Summary]:::black
    
    ShippingInfo --> Review[Review Order]:::gold
    BillingInfo --> Review
    OrderSummary --> Review
    
    Review --> ProcessPayment[Process Payment]:::black
    ProcessPayment --> PaymentSuccess{Success?}:::gold
    
    PaymentSuccess -->|Yes| OrderConfirm[Order Confirmed]:::gold
    PaymentSuccess -->|No| PaymentError[Payment Failed]:::error
    
    OrderConfirm --> SendEmail[Confirmation Email]:::black
    OrderConfirm --> ClearCart[Clear Cart]:::black
    
    classDef gold fill:#D4AF37,stroke:#000,stroke-width:2px,color:#000
    classDef black fill:#1a1a1a,stroke:#D4AF37,stroke-width:2px,color:#D4AF37
    classDef error fill:#cc0000,stroke:#000,stroke-width:2px,color:#fff
```

---

## Features

### Product Browsing
- Grid view with product cards
- Filter by category, price, etc.
- Sort by relevance, price, name
- Search functionality

### Cart Management
- Add/remove items
- Update quantities
- View cart total
- Cart badge shows item count
- Persistent cart (local storage)

### Checkout Process
1. **Authentication Check** - Login required
2. **Shipping Information** - Address form
3. **Billing Information** - Payment details
4. **Order Review** - Final confirmation
5. **Payment Processing** - Secure payment
6. **Order Confirmation** - Success page and email

---

## Implementation Notes

- Cart stored in localStorage for guests
- Full checkout requires authentication
- Payment gateway integration (Stripe/PayPal)
- Email confirmation after successful order
- Order history for registered users

---

**Related Documents:**
- [Gallery Flow](./gallery-flow.md)
- [Main Application Flow](./main-application-flow.md)
