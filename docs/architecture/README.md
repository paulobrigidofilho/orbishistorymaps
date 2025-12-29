---

<!--
  ORBIS Architecture Index & Guide
  
  Document Type: Architecture Overview & Reference
  Purpose: Central hub for all architecture documentation
  Last Updated: December 29, 2025
-->

# 🏗️ Architecture Documentation Index

Central reference guide for all Orbis application architecture documentation, providing quick navigation and overview of system design, components, and data flow.

---

## 📋 Current Development Status (December 2025)

### Completed ✅
- Core authentication system (register, login, logout)
- Product catalog and shopping cart
- Basic wishlist functionality
- User profile management
- Order history tracking
- Session-based authentication
- Full database schema
- Complete API endpoints (40+)
- Admin dashboard (basic)

### In Progress 🔄
- **Component Refactoring** - Separating buttons, helpers, and functions (~40% complete)
- **Page Development** - Gallery, Home, About Us pages (currently blank, ~20% complete)
- **Admin Dashboard Polish** - Code refactoring and testing (~60% complete)
- **Error Pages** - Custom 403, 404, 500 pages (not started)
- **Regional Updates** - Default location/currency change to NZ/NZD (not started)

### Planned Next 📝
- Payment processing and order simulation
- Rating system with admin management
- Admin settings interface (maintenance mode, registration toggle, etc.)
- Google Address Autocomplete API integration
- Shipping tier system (8 regional tiers for NZ/International)
- Shopping flow automation (Pending → Processing → Shipped → Delivered)

### Key Changes (Recent)
- **Default Country:** Changed from USA to New Zealand
- **Default Currency:** Changed from USD to NZD (New Zealand Dollars)
- **Address Validation:** Preparing for NZ-specific validation
- **Shipping Tiers:** Planning 8-tier system (local, national NI/SI, 5 international regions)

---

## 📚 Architecture Documents

### 1. **System Architecture Overview**
- **File:** [system-architecture.md](./system-architecture.md)
- **Size:** ~22 KB
- **Purpose:** Complete system design, technology stack, and design patterns
- **Key Sections:**
  - Technology stack overview
  - System architecture diagram
  - Frontend architecture with directory structure
  - Backend architecture and components
  - Database schema overview
  - Data flow patterns (auth, shopping, checkout)
  - Security architecture
  - Deployment architecture
- **Use When:** You need to understand the overall system design
- **Status:** ✅ Complete

### 2. **API Architecture & Design**
- **File:** [api-architecture.md](./api-architecture.md)
- **Size:** ~28 KB
- **Purpose:** Complete REST API specification and design documentation
- **Key Sections:**
  - API characteristics and design principles
  - Response format standards
  - Authentication endpoints (register, login, logout, session)
  - Profile endpoints (get, update personal, address, avatar, password)
  - Product endpoints (list, get single, categories, search)
  - Cart endpoints (get, add, update, remove, clear)
  - Order endpoints (create, list, details, invoice)
  - Wishlist endpoints (get, add, remove)
  - Admin endpoints (users, stats)
  - Middleware and interceptors
  - API architecture diagram
- **Endpoints:** 40+ documented endpoints with request/response examples
- **Use When:** Developing frontend features, testing API, integrating new features
- **Status:** ✅ Complete

### 3. **Component Architecture**
- **File:** [component-architecture.md](./component-architecture.md)
- **Size:** ~18 KB
- **Purpose:** Frontend component system design and specifications
- **Key Sections:**
  - Component system overview (React, Context API, React Router)
  - Complete component hierarchy tree
  - Core component specifications (App, AuthContext, MainNavBar, ProductCard, etc.)
  - 12+ reusable component definitions
  - State management patterns (Context, custom hooks, local state)
  - Component communication patterns
  - Component specifications (FormInput, Button, Modal, Table)
  - Performance optimization guidelines
  - Component development checklist
- **Components Documented:** 15+ components with props and responsibilities
- **Use When:** Building new components, refactoring UI, understanding component structure
- **Status:** ✅ Complete

### 4. **Database Schema & Architecture**
- **File:** [database-schema.md](./database-schema.md)
- **Size:** ~26 KB
- **Purpose:** PostgreSQL database design and specifications
- **Key Sections:**
  - Database overview and design principles
  - Complete database ER diagram (mermaid)
  - 10 table definitions with SQL DDL:
    - users (user accounts)
    - sessions (login sessions)
    - user_profiles (profile information)
    - products (product catalog)
    - carts (shopping carts)
    - cart_items (cart line items)
    - orders (customer orders)
    - order_items (order line items)
    - wishlists (user wishlists)
    - wishlist_items (wishlist items)
  - Common queries (auth, cart, orders, analytics)
  - Indexing strategy
  - Query optimization tips
  - Backup strategy
  - Database security
- **Database Size:** 10 tables with relationships
- **Use When:** Querying data, optimizing performance, managing schema
- **Status:** ✅ Complete

### 5. **Page Hierarchy**
- **File:** [page-hierarchy.md](./page-hierarchy.md)
- **Size:** ~20 KB
- **Purpose:** Complete application page structure and routing
- **Key Sections:**
  - Page hierarchy tree diagram
  - Complete page reference (15+ pages)
  - Access control matrix
  - File organization
  - Route definitions with code examples
  - Page statistics
- **Pages Documented:** 19 total pages (5 public, 4 auth, 7 protected, 3 admin)
- **Use When:** Understanding page structure, adding new pages, implementing routes
- **Status:** ✅ Complete

### 6. **Navigation Structure**
- **File:** [navigation-structure.md](./navigation-structure.md)
- **Size:** ~18 KB
- **Purpose:** User interface navigation design and implementation
- **Key Sections:**
  - Navigation architecture diagram
  - MainNavBar component specifications
  - Left section (Logo)
  - Center section (Navigation links, search)
  - Right section (Wishlist, cart, profile)
  - Responsive behavior (desktop, tablet, mobile)
  - Interaction patterns
  - Styling and theming
  - Authentication states
  - Component props and state
- **Responsive Layouts:** ASCII diagrams for 3 breakpoints
- **Use When:** Building navigation, updating header, implementing mobile menu
- **Status:** ✅ Complete

### 7. **User Roles & Permissions**
- **File:** [user-roles.md](./user-roles.md)
- **Size:** ~18 KB
- **Purpose:** Access control and permission system design
- **Key Sections:**
  - User type definitions (guest, registered, admin)
  - 23-feature permission matrix
  - Frontend implementation (AuthContext, ProtectedRoute)
  - Backend implementation (middleware, route protection)
  - Database schema (users, sessions tables)
  - 5 detailed access control scenarios
  - Security considerations
  - Role statistics
- **Features Documented:** 23 features with permission levels
- **Use When:** Implementing access control, protecting routes, checking permissions
- **Status:** ✅ Complete

---

## 🗂️ Quick Navigation

### By Use Case

**Building New Features:**
1. Check [Page Hierarchy](./page-hierarchy.md) for page structure
2. Review [Component Architecture](./component-architecture.md) for component patterns
3. Check [API Architecture](./api-architecture.md) for API endpoints
4. Reference [Database Schema](./database-schema.md) for data models

**Debugging Issues:**
1. Check [System Architecture](./system-architecture.md) for overall design
2. Review [API Architecture](./api-architecture.md) for endpoint behavior
3. Check [Database Schema](./database-schema.md) for data flow
4. Reference [User Roles & Permissions](./user-roles.md) for access issues

**Performance Optimization:**
1. Check [Database Schema](./database-schema.md) for indexing and queries
2. Review [Component Architecture](./component-architecture.md) for rendering optimization
3. Check [System Architecture](./system-architecture.md) for architecture considerations

**Security Review:**
1. Check [System Architecture](./system-architecture.md) security section
2. Review [User Roles & Permissions](./user-roles.md) for access control
3. Check [Database Schema](./database-schema.md) for data protection
4. Reference [API Architecture](./api-architecture.md) for endpoint security

---

## 📊 Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                 PRESENTATION LAYER                      │
│        React Components, Pages, Navigation              │
│          [Component Architecture](./component-architecture.md)
│          [Navigation Structure](./navigation-structure.md)
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│               APPLICATION LAYER                         │
│         Routing, State Management, Context API          │
│          [System Architecture](./system-architecture.md)
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                  API LAYER                              │
│         REST Endpoints, Controllers, Middleware         │
│          [API Architecture](./api-architecture.md)
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                  DATA LAYER                             │
│      PostgreSQL Database, Queries, Relationships        │
│          [Database Schema](./database-schema.md)
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Key Data Flows

### Authentication Flow
```
User enters email/password
  ↓
[API Architecture](./api-architecture.md) - POST /api/auth/login
  ↓
[Database Schema](./database-schema.md) - Validate user in users table
  ↓
[System Architecture](./system-architecture.md) - Create session in sessions table
  ↓
[Component Architecture](./component-architecture.md) - Update AuthContext
  ↓
[Navigation Structure](./navigation-structure.md) - Update user menu
```

### Shopping Cart Flow
```
User clicks "Add to Cart"
  ↓
[Component Architecture](./component-architecture.md) - ProductCard component
  ↓
[API Architecture](./api-architecture.md) - POST /api/cart
  ↓
[Database Schema](./database-schema.md) - Update cart_items table
  ↓
[Navigation Structure](./navigation-structure.md) - Update cart badge
```

### Checkout Flow
```
User clicks "Proceed to Checkout"
  ↓
[Page Hierarchy](./page-hierarchy.md) - Navigate to checkout page
  ↓
[Component Architecture](./component-architecture.md) - CheckoutForm component
  ↓
[API Architecture](./api-architecture.md) - POST /api/orders
  ↓
[Database Schema](./database-schema.md) - Create order and order_items
  ↓
[User Roles & Permissions](./user-roles.md) - Verify user permissions
```

---

## 📈 Technology Stack

| Layer | Technology | Documentation |
|-------|-----------|---|
| **Frontend** | React 18+, Vite, React Router | [Component Architecture](./component-architecture.md), [System Architecture](./system-architecture.md) |
| **Backend** | Node.js, Express.js | [API Architecture](./api-architecture.md), [System Architecture](./system-architecture.md) |
| **Database** | PostgreSQL | [Database Schema](./database-schema.md) |
| **State Mgmt** | Context API | [Component Architecture](./component-architecture.md) |
| **Styling** | CSS Modules | [Navigation Structure](./navigation-structure.md), [Component Architecture](./component-architecture.md) |
| **Authentication** | Session-based, httpOnly cookies | [System Architecture](./system-architecture.md), [User Roles & Permissions](./user-roles.md) |
| **API Pattern** | RESTful | [API Architecture](./api-architecture.md) |

---

## 🎯 Architecture Principles

1. **Separation of Concerns** - Frontend/backend clearly separated
2. **Component-Based** - Reusable React components
3. **Session-Based Auth** - Server sessions with secure cookies
4. **Database Normalization** - Reduce redundancy, maintain integrity
5. **Responsive Design** - Mobile, tablet, desktop support
6. **Security First** - Validation, sanitization, access control
7. **Scalability** - Design for growth and performance
8. **Consistency** - Uniform patterns and conventions

---

## 📋 Document Checklist

Architecture documentation status:

- ✅ System Architecture Overview (22 KB)
- ✅ API Architecture & Design (28 KB)
- ✅ Component Architecture (18 KB)
- ✅ Database Schema & Architecture (26 KB)
- ✅ Page Hierarchy (20 KB)
- ✅ Navigation Structure (18 KB)
- ✅ User Roles & Permissions (18 KB)
- ✅ Architecture Index (this document)

**Total Documentation:** ~194 KB across 8 comprehensive architecture files

---

## 🔗 Related Documentation

### Flows & Charts
- [Authentication Flow](../flows/authentication-flow.md) - Login/registration flow
- [Profile Management Flow](../flows/profile-management-flow.md) - Profile operations
- [Main Application Flow](../flows/main-application-flow.md) - Overall navigation
- [Authentication Flow Chart](../charts/authentication-flow-chart.md) - Visual flows

### Quickstart Guides
- [Authentication System](../quickstart/authentication.md) - Auth implementation
- [Shop Structure](../quickstart/shop-structure.md) - Shop module guide
- [Order Management](../quickstart/order-management.md) - Checkout and orders
- [Admin System](../quickstart/admin-system.md) - Admin panel guide

### Project Documents
- [Sitemap](../sitemap.md) - Main documentation index
- [Future Enhancements](../future-enhancements.md) - Planned features

---

## 💡 How to Use This Documentation

### For New Developers
1. Start with [System Architecture](./system-architecture.md) for overview
2. Read [Component Architecture](./component-architecture.md) to understand frontend
3. Read [API Architecture](./api-architecture.md) to understand backend
4. Reference [Database Schema](./database-schema.md) as needed
5. Use [Page Hierarchy](./page-hierarchy.md) for navigation structure

### For Frontend Development
1. Check [Component Architecture](./component-architecture.md) for patterns
2. Use [Navigation Structure](./navigation-structure.md) for header/nav
3. Reference [Page Hierarchy](./page-hierarchy.md) for page structure
4. Check [API Architecture](./api-architecture.md) for endpoint calls

### For Backend Development
1. Reference [API Architecture](./api-architecture.md) for endpoints
2. Use [Database Schema](./database-schema.md) for queries
3. Check [System Architecture](./system-architecture.md) for patterns
4. Reference [User Roles & Permissions](./user-roles.md) for access control

### For Database Work
1. Use [Database Schema](./database-schema.md) for table definitions
2. Reference common queries for examples
3. Check indexing strategy for optimization
4. Follow backup procedures

### For Security Review
1. Check [System Architecture](./system-architecture.md) security section
2. Review [User Roles & Permissions](./user-roles.md) for access control
3. Check [API Architecture](./api-architecture.md) for endpoint security
4. Reference [Database Schema](./database-schema.md) for data protection

---

## 📞 Support & Questions

For questions about specific architecture areas:
- **Frontend Architecture:** See [Component Architecture](./component-architecture.md)
- **Backend Architecture:** See [API Architecture](./api-architecture.md)
- **Database Design:** See [Database Schema](./database-schema.md)
- **System Design:** See [System Architecture](./system-architecture.md)
- **Access Control:** See [User Roles & Permissions](./user-roles.md)
- **Navigation/UI:** See [Navigation Structure](./navigation-structure.md)
- **Pages/Routes:** See [Page Hierarchy](./page-hierarchy.md)

---

**Document Version:** 1.0  
**Last Updated:** December 29, 2025  
**Completion Status:** ✅ Architecture documentation complete (7 comprehensive documents + 1 index)

---

## 🆕 Upcoming Architecture Additions

### Rating System Architecture
As the rating system is developed, new documentation will include:
- **Rating Database Schema** - Tables for ratings, comments, and edit history
- **Email-based Collection** - Automatic rating links sent after delivery
- **Admin Rating Management** - Dedicated dashboard for viewing, editing, and moderating ratings
- **Rating Statistics** - Metrics and analytics on product ratings

### Admin Settings Architecture
As admin settings are implemented, new documentation will include:
- **Shipping Tier Configuration** - 8-tier system: Local (Tauranga), National (NI/SI), International (5 regions)
- **Application Settings** - Maintenance modes, registration toggle, notifications
- **Google Address Autocomplete API** - Integration and regional tier auto-detection
- **System Configuration** - Global settings and preferences

### Regional & Localization Updates
- **New Zealand Defaults** - Default country/region for users
- **NZD Currency** - All prices displayed in New Zealand Dollars
- **NZ Address Validation** - Address fields optimized for New Zealand
- **Regional Shipping Rates** - Distance-based and tier-based calculations