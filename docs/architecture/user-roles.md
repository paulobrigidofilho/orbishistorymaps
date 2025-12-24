# User Roles & Permissions

This document defines the different user types and their access permissions in the Orbis application.

---

## Roles Diagram

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#D4AF37','primaryTextColor':'#000','primaryBorderColor':'#000','lineColor':'#D4AF37','secondaryColor':'#1a1a1a','tertiaryColor':'#333'}}}%%
graph TD
    Users[User Types]:::gold --> Guest[Guest User]:::black
    Users --> Registered[Registered User]:::black
    Users --> Admin[Admin - Future]:::error
    
    Guest --> GuestPerms[View Public Pages<br/>Browse Products<br/>View Gallery<br/>Add to Cart]:::gold
    
    Registered --> RegPerms[All Guest Permissions<br/>+<br/>Complete Checkout<br/>Manage Profile<br/>View Order History]:::gold
    
    Admin --> AdminPerms[All User Permissions<br/>+<br/>Manage Products<br/>Manage Users<br/>View Analytics]:::gold
    
    classDef gold fill:#D4AF37,stroke:#000,stroke-width:2px,color:#000
    classDef black fill:#1a1a1a,stroke:#D4AF37,stroke-width:2px,color:#D4AF37
    classDef error fill:#cc0000,stroke:#000,stroke-width:2px,color:#fff
```

---

## User Types

### Guest User (Unauthenticated)
**Permissions:**
- ✅ View public pages (Home, Shop, Gallery, About)
- ✅ Browse products
- ✅ View product details
- ✅ Add items to cart (local storage)
- ❌ Cannot complete checkout
- ❌ Cannot save profile data
- ❌ Cannot view order history

### Registered User (Authenticated)
**Permissions:**
- ✅ All guest permissions
- ✅ Complete checkout process
- ✅ Create and manage profile
- ✅ Upload and manage avatar
- ✅ View order history
- ✅ Save multiple addresses
- ✅ View own profile
- ❌ Cannot access admin features
- ❌ Cannot view other users' data

### Admin (Future Implementation)
**Permissions:**
- ✅ All registered user permissions
- ✅ Manage products (CRUD operations)
- ✅ Manage users (view, edit, disable)
- ✅ View all orders
- ✅ Access analytics dashboard
- ✅ Manage site content
- ✅ Configure system settings

---

## Permission Matrix

| Feature | Guest | Registered | Admin |
|---------|-------|------------|-------|
| View Public Pages | ✅ | ✅ | ✅ |
| Browse Products | ✅ | ✅ | ✅ |
| Add to Cart | ✅ | ✅ | ✅ |
| Complete Checkout | ❌ | ✅ | ✅ |
| Manage Profile | ❌ | ✅ Own | ✅ All |
| View Orders | ❌ | ✅ Own | ✅ All |
| Product Management | ❌ | ❌ | ✅ |
| User Management | ❌ | ❌ | ✅ |
| Analytics | ❌ | ❌ | ✅ |

---

## Profile Access Rules

### Viewing Profiles
- Users can view their own profile
- Users cannot view other users' profiles (current implementation)
- Future: Public profile pages with privacy settings

### Editing Profiles
- Users can only edit their own profile
- Admins can edit any profile
- Certain fields may be locked (email verification status, etc.)

---

## Implementation Notes

- Role stored in user database table
- Middleware checks role before allowing access
- Frontend hides unavailable features based on role
- Backend enforces permissions on all API endpoints

---

**Related Documents:**
- [Authentication Flow](../flows/authentication-flow.md)
- [Page Hierarchy](./page-hierarchy.md)
- [Navigation Structure](./navigation-structure.md)
