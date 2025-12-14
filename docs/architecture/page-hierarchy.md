# Page Hierarchy

This document shows the complete hierarchical structure of all pages in the Orbis application.

---

## Structure Diagram

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#D4AF37','primaryTextColor':'#000','primaryBorderColor':'#000','lineColor':'#D4AF37','secondaryColor':'#1a1a1a','tertiaryColor':'#333'}}}%%
graph TD
    Root[Orbis Root]:::gold --> Public[Public Pages]:::black
    Root --> Auth[Auth Pages]:::black
    Root --> Protected[Protected Pages]:::black
    
    Public --> Home[Home]:::gold
    Public --> Shop[Shop]:::gold
    Public --> Gallery[Gallery]:::gold
    Public --> About[About Us]:::gold
    Public --> ProductPage[Product Details]:::gold
    
    Auth --> LoginModal[Login Modal]:::gold
    Auth --> Register[Registration]:::gold
    Auth --> ForgotPW[Forgot Password]:::gold
    Auth --> ResetPW[Reset Password]:::gold
    
    Protected --> Profile[Profile]:::gold
    Protected --> Checkout[Checkout]:::gold
    Protected --> Orders[Order History]:::gold
    Protected --> OrderDetails[Order Details]:::gold
    
    classDef gold fill:#D4AF37,stroke:#000,stroke-width:2px,color:#000
    classDef black fill:#1a1a1a,stroke:#D4AF37,stroke-width:2px,color:#D4AF37
```

---

## Page Categories

### Public Pages (No Auth Required)
- **Home** - `/` - Landing page
- **Shop** - `/shop` - Product catalog (planned)
- **Gallery** - `/gallery` - Interactive gallery (planned)
- **About Us** - `/about` - Company info (planned)
- **Product Details** - `/product/:id` - Individual product (planned)

### Authentication Pages
- **Login Modal** - Overlay modal
- **Registration** - `/register` - Full registration form
- **Forgot Password** - `/forgot-password` - Email entry (planned)
- **Reset Password** - `/reset-password/:token` - New password form (planned)

### Protected Pages (Auth Required)
- **Profile** - `/profile/:userId` - User profile
- **Checkout** - `/checkout` - Order completion (planned)
- **Order History** - `/orders` - Past orders (planned)
- **Order Details** - `/order/:id` - Specific order (planned)

---

## Access Control

| Page Category | Guest Access | User Access | Admin Access |
|--------------|--------------|-------------|--------------|
| Public Pages | ✅ View | ✅ View | ✅ View |
| Auth Pages | ✅ Access | ✅ Access | ✅ Access |
| Protected Pages | ❌ Redirect to Login | ✅ View Own | ✅ View All |

---

**Related Documents:**
- [Navigation Structure](./navigation-structure.md)
- [User Roles & Permissions](./user-roles.md)
