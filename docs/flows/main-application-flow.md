# Main Application Flow

This document describes the overall navigation structure and primary user flows through the Orbis application.

---

## Flow Diagram

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#D4AF37','primaryTextColor':'#000','primaryBorderColor':'#000','lineColor':'#D4AF37','secondaryColor':'#1a1a1a','tertiaryColor':'#333'}}}%%
graph TD
    Start([User Visits Site]):::gold --> Home[Home Page]:::black
    
    Home --> NavBar{Navigation}:::gold
    NavBar --> Shop[Shop]:::black
    NavBar --> Gallery[Gallery]:::black
    NavBar --> About[About Us]:::black
    NavBar --> Profile{Profile}:::gold
    NavBar --> Cart[Cart]:::black
    
    Profile -->|Guest| LoginModal[Login Modal]:::gold
    Profile -->|User| ProfileMenu[Profile Menu]:::gold
    
    LoginModal --> Login[Login]:::black
    LoginModal --> ForgotPW[Forgot Password]:::black
    LoginModal --> RegLink[Sign Up]:::black
    
    Login -->|Success| HomeAuth[Home - Auth]:::gold
    RegLink --> Register[Registration]:::gold
    Register -->|Success| HomeAuth
    
    ProfileMenu --> EditProf[Edit Profile]:::black
    ProfileMenu --> Logout[Logout]:::black
    
    Shop --> Products[Browse Products]:::gold
    Products --> Details[Product Details]:::black
    Products --> AddCart[Add to Cart]:::black
    
    Gallery --> GalleryView[Gallery Grid]:::gold
    GalleryView --> Expand[Expand Details]:::black
    Expand --> History[View History]:::gold
    
    Cart --> Checkout[Checkout]:::gold
    Checkout --> Payment[Payment]:::black
    Payment --> Confirm[Order Confirmed]:::gold
    
    About --> Contact[Contact Form]:::black
    About --> Team[Team Info]:::black
    About --> Map[Location Map]:::black
    
    classDef gold fill:#D4AF37,stroke:#000,stroke-width:2px,color:#000
    classDef black fill:#1a1a1a,stroke:#D4AF37,stroke-width:2px,color:#D4AF37
```

---

## Key Pages

### Public Pages
- **Home Page** - Landing page with featured content
- **Shop** - Product catalog (planned)
- **Gallery** - Interactive product gallery (planned)
- **About Us** - Company information (planned)

### Authentication
- **Login Modal** - Quick login overlay
- **Registration Page** - Full registration form
- **Forgot Password** - Password reset flow (planned)

### Protected Pages
- **Profile** - User profile management
- **Checkout** - Order completion (planned)
- **Order History** - Past orders (planned)

---

**Related Documents:**
- [Authentication Flow](./authentication-flow.md)
- [Shop & Cart Flow](./shop-cart-flow.md)
- [Page Hierarchy](../architecture/page-hierarchy.md)
