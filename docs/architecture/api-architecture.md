---

<!--
  ORBIS API Architecture & Specification
  
  Document Type: API Reference & Design
  Purpose: Complete REST API design, endpoints, contracts, and patterns
  Last Updated: December 29, 2025
-->

# 🔌 API Architecture & Design

Complete REST API specification for the Orbis backend, including endpoint documentation, request/response contracts, error handling, and design patterns.

---

## 📋 Overview

### API Characteristics
- **Type:** RESTful Web Service
- **Protocol:** HTTP/HTTPS
- **Base URL:** `http://localhost:3000/api` (dev) / `https://api.orbis.com` (prod)
- **Authentication:** Session-based with httpOnly cookies
- **Content-Type:** application/json
- **CORS:** Enabled for frontend origin

### Design Principles
1. **Stateless Requests** - Each request contains all needed context
2. **Meaningful HTTP Verbs** - GET, POST, PATCH, DELETE used correctly
3. **Consistent Response Format** - All responses follow same structure
4. **Error Standardization** - Consistent error response format
5. **Versioning** - Currently v1 (potential for v2, v3 in future)

---

## 📤 Response Format

### Success Response
```json
{
  "success": true,
  "status": 200,
  "data": { /* endpoint specific */ },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "status": 400,
  "message": "Description of what went wrong",
  "errors": [ /* validation errors if applicable */ ]
}
```

### Status Codes
- **200 OK** - Request successful
- **201 Created** - Resource created
- **204 No Content** - Successful with no return data
- **400 Bad Request** - Invalid input
- **401 Unauthorized** - Not authenticated
- **403 Forbidden** - Not authorized
- **404 Not Found** - Resource doesn't exist
- **409 Conflict** - Resource conflict (duplicate email)
- **500 Internal Server Error** - Server error
- **503 Service Unavailable** - Maintenance

---

## 🔐 Authentication Endpoints

### Register (Create Account)
```
POST /api/auth/register

Request Body:
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}

Response (201 Created):
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "nickname": null,
    "avatar_url": null,
    "role": "user",
    "created_at": "2025-12-29T10:00:00Z"
  }
}

Error Cases:
- 400: Email already exists
- 400: Password too weak
- 400: Missing required fields
```

### Login (Authenticate)
```
POST /api/auth/login

Request Body:
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response (200 OK):
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "avatar_url": "https://..."
  },
  "message": "Login successful"
}

Headers Set:
- Set-Cookie: sessionId=...; HttpOnly; Secure; SameSite=Strict

Error Cases:
- 401: Invalid email or password
- 429: Too many login attempts
```

### Logout (End Session)
```
DELETE /api/auth/logout

Request: No body required
Authentication: Required (session cookie)

Response (200 OK):
{
  "success": true,
  "message": "Logged out successfully"
}

Cookies Cleared:
- sessionId removed
```

### Get Session
```
GET /api/auth/session

Request: No body
Authentication: Required (session cookie)

Response (200 OK):
{
  "success": true,
  "data": {
    "isAuthenticated": true,
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "user",
      "firstName": "John"
    }
  }
}

Response if Not Authenticated (401):
{
  "success": false,
  "status": 401,
  "data": { "isAuthenticated": false },
  "message": "No active session"
}
```

---

## 👤 Profile Endpoints

### Get Profile
```
GET /api/profile

Authentication: Required
Role: User

Response (200 OK):
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "nickname": "Johnny",
    "avatar_url": "https://...",
    "created_at": "2025-12-29T10:00:00Z",
    "personal": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "user@example.com"
    },
    "address": {
      "street": "123 Main St",
      "apartment": "Apt 4B",
      "city": "New York",
      "state": "NY",
      "zip": "10001",
      "country": "USA"
    }
  }
}
```

### Update Personal Info
```
PATCH /api/profile/personal

Authentication: Required
Request Body:
{
  "firstName": "John",
  "lastName": "Doe",
  "nickname": "Johnny"
}

Response (200 OK):
{
  "success": true,
  "data": {
    "firstName": "John",
    "lastName": "Doe",
    "nickname": "Johnny"
  }
}

Error Cases:
- 400: Duplicate email
- 400: Invalid data
```

### Update Address
```
PATCH /api/profile/address

Authentication: Required
Request Body:
{
  "street": "123 Main St",
  "apartment": "Apt 4B",
  "city": "New York",
  "state": "NY",
  "zip": "10001",
  "country": "USA"
}

Response (200 OK):
{
  "success": true,
  "data": { /* updated address */ }
}
```

### Upload Avatar
```
POST /api/profile/avatar

Authentication: Required
Content-Type: multipart/form-data
Body: File (max 5MB, image only)

Response (201 Created):
{
  "success": true,
  "data": {
    "avatar_url": "https://..."
  }
}

Error Cases:
- 400: Invalid file type
- 413: File too large
```

### Delete Avatar
```
DELETE /api/profile/avatar

Authentication: Required

Response (200 OK):
{
  "success": true,
  "message": "Avatar deleted"
}
```

### Change Password
```
POST /api/profile/password

Authentication: Required
Request Body:
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass456!"
}

Response (200 OK):
{
  "success": true,
  "message": "Password changed successfully"
}

Error Cases:
- 400: Current password incorrect
- 400: New password too weak
- 400: New password same as old
```

---

## 🛍️ Product Endpoints

### List Products
```
GET /api/products?category=electronics&sort=price&order=asc&page=1&limit=20

Query Parameters:
- category (optional): Filter by category
- sort (optional): price, name, newest
- order (optional): asc, desc
- search (optional): Search term
- page (optional): Page number (default 1)
- limit (optional): Items per page (default 20)

Authentication: Not required

Response (200 OK):
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "uuid",
        "name": "Product Name",
        "description": "Description",
        "price": 99.99,
        "inventory": 50,
        "category": "electronics",
        "image_url": "https://...",
        "created_at": "2025-12-29T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

### Get Single Product
```
GET /api/products/:productId

Authentication: Not required

Response (200 OK):
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Product Name",
    "description": "Full description",
    "price": 99.99,
    "inventory": 50,
    "category": "electronics",
    "image_url": "https://...",
    "inWishlist": false,
    "inCart": false
  }
}

Error Cases:
- 404: Product not found
```

### Get Categories
```
GET /api/products/categories

Authentication: Not required

Response (200 OK):
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Electronics",
      "count": 45
    },
    {
      "id": "uuid",
      "name": "Clothing",
      "count": 78
    }
  ]
}
```

### Search Products
```
GET /api/products/search?q=laptop&limit=10

Query Parameters:
- q (required): Search term
- limit (optional): Max results (default 10)

Authentication: Not required

Response (200 OK):
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Laptop Computer",
      "price": 999.99,
      "image_url": "https://..."
    }
  ]
}
```

---

## 🛒 Cart Endpoints

### Get Cart
```
GET /api/cart

Authentication: Required for registered users, optional for guests
Session: Required for guest cart

Response (200 OK):
{
  "success": true,
  "data": {
    "id": "uuid",
    "items": [
      {
        "id": "item-uuid",
        "product": {
          "id": "uuid",
          "name": "Product",
          "price": 99.99,
          "image_url": "https://..."
        },
        "quantity": 2,
        "subtotal": 199.98
      }
    ],
    "subtotal": 199.98,
    "tax": 15.99,
    "shipping": 9.99,
    "total": 225.96,
    "itemCount": 2
  }
}
```

### Add to Cart
```
POST /api/cart

Authentication: Optional
Request Body:
{
  "productId": "uuid",
  "quantity": 2
}

Response (201 Created):
{
  "success": true,
  "data": {
    "item": {
      "id": "item-uuid",
      "productId": "uuid",
      "quantity": 2
    },
    "cart": { /* updated cart */ }
  }
}

Error Cases:
- 404: Product not found
- 400: Quantity exceeds inventory
```

### Update Cart Item
```
PATCH /api/cart/:cartItemId

Authentication: Required
Request Body:
{
  "quantity": 5
}

Response (200 OK):
{
  "success": true,
  "data": { /* updated cart */ }
}

Error Cases:
- 404: Cart item not found
- 400: Quantity exceeds inventory
```

### Remove from Cart
```
DELETE /api/cart/:cartItemId

Authentication: Required

Response (200 OK):
{
  "success": true,
  "data": { /* updated cart */ }
}

Error Cases:
- 404: Cart item not found
```

### Clear Cart
```
DELETE /api/cart

Authentication: Required

Response (200 OK):
{
  "success": true,
  "message": "Cart cleared"
}
```

---

## 📦 Order Endpoints

### Create Order
```
POST /api/orders

Authentication: Required
Request Body:
{
  "shippingAddress": {
    "street": "123 Main St",
    "apartment": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "zip": "10001"
  },
  "paymentMethod": "credit_card"
}

Response (201 Created):
{
  "success": true,
  "data": {
    "id": "order-uuid",
    "userId": "uuid",
    "items": [ /* from cart */ ],
    "total": 225.96,
    "status": "pending",
    "created_at": "2025-12-29T10:00:00Z"
  }
}

Error Cases:
- 400: Cart is empty
- 400: Invalid address
- 409: Payment failed
```

### Get Orders List
```
GET /api/orders?page=1&limit=10&status=all

Query Parameters:
- page (optional): Page number
- limit (optional): Items per page
- status (optional): pending, shipped, delivered, all

Authentication: Required

Response (200 OK):
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "order-uuid",
        "items": [ /* items */ ],
        "total": 225.96,
        "status": "shipped",
        "created_at": "2025-12-29T10:00:00Z"
      }
    ],
    "pagination": { /* pagination info */ }
  }
}
```

### Get Order Details
```
GET /api/orders/:orderId

Authentication: Required (user must own order)

Response (200 OK):
{
  "success": true,
  "data": {
    "id": "order-uuid",
    "user": {
      "id": "uuid",
      "email": "user@example.com"
    },
    "items": [ /* detailed items */ ],
    "shippingAddress": { /* address */ },
    "total": 225.96,
    "status": "shipped",
    "created_at": "2025-12-29T10:00:00Z"
  }
}
```

### Download Invoice
```
GET /api/orders/:orderId/invoice

Authentication: Required
Accept: application/pdf

Response: PDF file
```

---

## ❤️ Wishlist Endpoints

### Get Wishlist
```
GET /api/wishlist

Authentication: Required

Response (200 OK):
{
  "success": true,
  "data": {
    "id": "wishlist-uuid",
    "items": [
      {
        "id": "uuid",
        "name": "Product",
        "price": 99.99,
        "image_url": "https://..."
      }
    ],
    "itemCount": 5
  }
}
```

### Add to Wishlist
```
POST /api/wishlist

Authentication: Required
Request Body:
{
  "productId": "uuid"
}

Response (201 Created):
{
  "success": true,
  "data": { /* updated wishlist */ }
}

Error Cases:
- 404: Product not found
- 409: Already in wishlist
```

### Remove from Wishlist
```
DELETE /api/wishlist/:productId

Authentication: Required

Response (200 OK):
{
  "success": true,
  "data": { /* updated wishlist */ }
}
```

---

## 👨‍💼 Admin Endpoints

### Get All Users
```
GET /api/admin/users?page=1&limit=20&role=user

Authentication: Required
Authorization: Admin role required

Query Parameters:
- page (optional): Page number
- limit (optional): Items per page
- role (optional): Filter by role

Response (200 OK):
{
  "success": true,
  "data": {
    "users": [ /* user list */ ],
    "pagination": { /* info */ }
  }
}
```

### Update User
```
PATCH /api/admin/users/:userId

Authentication: Required
Authorization: Admin role required

Request Body:
{
  "role": "user",
  "status": "active"
}

Response (200 OK):
{
  "success": true,
  "data": { /* updated user */ }
}
```

### Delete User
```
DELETE /api/admin/users/:userId

Authentication: Required
Authorization: Admin role required

Response (200 OK):
{
  "success": true,
  "message": "User deleted"
}
```

### Get Dashboard Stats
```
GET /api/admin/stats

Authentication: Required
Authorization: Admin role required

Response (200 OK):
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "activeUsers": 145,
    "totalOrders": 450,
    "totalRevenue": 45000.00,
    "averageOrderValue": 100.00
  }
}
```

---

## 🔄 Middleware & Interceptors

### Authentication Middleware
```javascript
// Validates session on every request
- Checks httpOnly cookie
- Validates session in database
- Attaches user to request
- Returns 401 if invalid
```

### Authorization Middleware
```javascript
// Validates user role/permissions
- Checks user.role
- Verifies resource ownership
- Returns 403 if unauthorized
```

### Validation Middleware
```javascript
// Validates request data
- Uses express-validator
- Sanitizes inputs
- Returns 400 with errors
```

### Error Handler Middleware
```javascript
// Global error handling
- Catches all errors
- Returns standardized format
- Logs errors
- Returns appropriate status code
```

---

## 📊 API Architecture Diagram

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#D4AF37','primaryTextColor':'#000','primaryBorderColor':'#000','lineColor':'#D4AF37','secondaryColor':'#1a1a1a','tertiaryColor':'#333'}}}%%
graph TB
    Client["Frontend<br/>React Client"]:::gold -->
    Router["Express Router<br/>Route Handlers"]:::black -->
    Auth["Auth Middleware<br/>Session Validation"]:::gold -->
    Validation["Validation Middleware<br/>Input Sanitization"]:::black -->
    Controller["Controllers<br/>Business Logic"]:::gold -->
    Service["Services<br/>Database Queries"]:::black -->
    Database["PostgreSQL<br/>Data Storage"]:::error -->
    
    Client -->|HTTP Request| Router
    Router -->|Check Auth| Auth
    Auth -->|Validate Input| Validation
    Validation -->|Execute Logic| Controller
    Controller -->|Query Data| Service
    Service -->|SQL| Database
    Database -->|Results| Service
    Service -->|Response| Controller
    Controller -->|JSON| Router
    Router -->|HTTP Response| Client
    
    classDef gold fill:#D4AF37,stroke:#000,stroke-width:2px,color:#000
    classDef black fill:#1a1a1a,stroke:#D4AF37,stroke-width:2px,color:#D4AF37
    classDef error fill:#cc0000,stroke:#000,stroke-width:2px,color:#fff
```

---

## 🔗 Related Documentation

- **[System Architecture](./system-architecture.md)** - Complete system design
- **[User Roles & Permissions](./user-roles.md)** - Access control
- **[Authentication Flow](../flows/authentication-flow.md)** - Auth implementation

---

**Document Version:** 1.0  
**Last Updated:** December 29, 2025  
**Status:** ✅ Complete