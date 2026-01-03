///////////////////////////////////////////////////////////////////////
// =================== ADMIN SYSTEM DOCUMENTATION ==================== //
///////////////////////////////////////////////////////////////////////

/**
 * DOCUMENT PURPOSE:
 * Complete guide to the admin system including dashboard, user management,
 * product management, order management, review management, wishlist analytics,
 * site settings, and freight configuration with backend API integration.
 * 
 * FEATURES: Admin Dashboard, User CRUD, Product CRUD, Order Management,
 *           Review Moderation, Wishlist Analytics, Site Settings, Freight Config
 * LAST UPDATED: January 4, 2026
 * VERSION: 2.0 (Sequelize ORM)
 */

---

## 📋 Overview

The **Admin System** provides comprehensive management capabilities for administrators to control all aspects of the Orbis platform. Features include:

- **Admin Dashboard** with real-time statistics and quick actions
- **User Management** with role/status control and country filtering
- **Product Management** with CRUD operations, image uploads, and wishlist counts
- **Order Management** with status and payment tracking ✨
- **Review Management** with moderation and rating breakdowns ✨
- **Wishlist Analytics** with product popularity insights ✨
- **Site Settings** with maintenance mode control ✨
- **Freight Configuration** with zone-based shipping rates ✨
- **Role-Based Access Control** protecting admin routes
- **Responsive Admin Interface** optimized for desktop

---

## 🗂️ File Structure

### Frontend

```
frontend/src/pages/admin/
├── AdminDashboard.jsx              # Main admin dashboard page
├── AdminDashboard.module.css
│
├── adminpages/
│   ├── AdminOrders/                # Order management section ✨
│   │   ├── AdminOrders.jsx
│   │   ├── AdminOrders.module.css
│   │   └── subcomponents/
│   │       ├── OrderDetailsModal.jsx
│   │       └── OrderStatusDropdown.jsx
│   │
│   ├── AdminProducts/
│   │   ├── AdminProducts.jsx       # Product list page
│   │   ├── AdminProducts.module.css
│   │   └── subcomponents/
│   │       ├── ProductEditModal.jsx
│   │       ├── AddProductModal.jsx
│   │       ├── DeleteProductModal.jsx
│   │       └── ProductRatingsModal.jsx  ✨
│   │
│   ├── AdminUsers/
│   │   ├── AdminUsers.jsx          # User list page
│   │   ├── AdminUsers.module.css
│   │   └── subcomponents/
│   │       ├── UserEditModal.jsx
│   │       └── DeleteUserModal.jsx
│   │
│   ├── AdminReviews/               # Review management ✨
│   │   ├── AdminReviews.jsx
│   │   ├── AdminReviews.module.css
│   │   └── subcomponents/
│   │       ├── ReviewEditModal.jsx
│   │       ├── DeleteReviewModal.jsx
│   │       └── ViewUserDetailsModal.jsx
│   │
│   ├── AdminWishlists/             # Wishlist analytics ✨
│   │   ├── AdminWishlists.jsx
│   │   ├── AdminWishlists.module.css
│   │   └── subcomponents/
│   │       └── WishlistModal.jsx
│   │
│   └── AdminSettings/              # Site settings ✨
│       ├── AdminSettings.jsx
│       └── subcomponents/
│           ├── FreightSettings.jsx
│           └── MaintenanceSettings.jsx
│
├── btn/
│   ├── index.js                    # Barrel export
│   ├── AddBtn.jsx
│   ├── EditBtn.jsx
│   ├── DeleteBtn.jsx
│   ├── ViewBtn.jsx                 ✨
│   ├── CloseBtn.jsx                ✨
│   ├── SaveBtn.jsx
│   ├── CancelBtn.jsx
│   ├── ConfirmBtn.jsx
│   └── AdminButtons.module.css
│
├── components/
│   ├── AdminLayout.jsx
│   ├── AdminManagementView.jsx     ✨ Reusable template
│   ├── AdminNavBar.jsx
│   ├── AdminSearchBar.jsx          ✨
│   ├── StatCard.jsx
│   ├── ActionCard.jsx
│   ├── PriceDisplay.jsx            ✨ NZD formatting
│   └── CountryFlag.jsx             ✨
│
├── constants/
│   ├── adminConstants.js
│   ├── adminNavBarConstants.js     ✨
│   ├── adminStatCardConstants.js   ✨
│   ├── adminActionCardConstants.js ✨
│   ├── adminSearchBarConstants.js  ✨
│   ├── adminErrorMessages.js
│   └── adminSuccessMessages.js
│
├── functions/
│   ├── fetchStats.js
│   ├── getAllUsers.js
│   ├── getAllProducts.js
│   ├── getAllOrders.js             ✨
│   ├── getAllReviews.js            ✨
│   ├── getAllWishlists.js          ✨
│   ├── getWishlistUsers.js         ✨
│   ├── updateOrderStatus.js        ✨
│   └── ...
│
└── helpers/
    ├── formatDateDMY.js
    ├── formatNZD.js                ✨
    └── ...
```

### Backend (Sequelize ORM)

```
backend/src/
├── config/
│   ├── config.js                   # Legacy DB pool
│   └── sequelizeConfig.js          # Sequelize instance ✨
│
├── models/                         # Sequelize models ✨
│   ├── index.js                    # Associations & exports
│   ├── User.js
│   ├── Product.js
│   ├── ProductCategory.js
│   ├── ProductImage.js
│   ├── ProductReview.js            ✨
│   ├── Order.js
│   ├── OrderItem.js
│   ├── Wishlist.js
│   ├── SiteSettings.js             ✨
│   ├── FreightConfig.js            ✨
│   └── ...
│
├── controllers/
│   ├── adminUserController.js
│   ├── adminProductController.js
│   ├── adminCategoryController.js
│   ├── adminStatsController.js
│   ├── adminOrderController.js     ✨
│   ├── adminReviewController.js    ✨
│   ├── adminWishlistController.js  ✨
│   ├── adminSettingsController.js  ✨
│   └── freightController.js        ✨
│
├── services/
│   ├── adminUserService.js
│   ├── adminProductService.js
│   ├── adminStatsService.js
│   ├── adminOrderService.js        ✨
│   ├── adminReviewService.js       ✨
│   ├── adminWishlistService.js     ✨
│   ├── adminSettingsService.js     ✨
│   └── freightService.js           ✨
│
├── routes/
│   ├── adminUserRoutes.js
│   ├── adminProductRoutes.js
│   ├── adminStatsRoutes.js
│   ├── adminOrderRoutes.js         ✨
│   ├── adminReviewRoutes.js        ✨
│   ├── adminWishlistRoutes.js      ✨
│   ├── adminSettingsRoutes.js      ✨
│   └── freightRoutes.js            ✨
│
├── middleware/
│   ├── authMiddleware.js
│   └── adminMiddleware.js
│
├── helpers/
│   └── zoneDetectionHelper.js      ✨ NZ zone detection
│
└── constants/
    └── adminMessages.js
```

---

## 🎯 Admin Dashboard

### Location
`frontend/src/pages/admin/AdminDashboard.jsx`
Route: `/admin`

### Features

**Statistics Display:**
- Total users count
- Total products count
- Active orders count
- Total revenue metrics (NZD)

**Quick Action Cards:**
- View all users
- Create new product
- View all products
- View all orders
- Manage reviews ✨
- View wishlists ✨
- Site settings ✨

**Layout:**
- Header with admin title
- Sidebar navigation (AdminNavBar)
- Main content area with stats grid
- Responsive design

---

## 📦 Admin Order Management ✨

### Location
`frontend/src/pages/admin/adminpages/AdminOrders/AdminOrders.jsx`
Route: `/admin/orders`

### Features
- Paginated order list with customer details
- Filter by order status (pending, processing, shipped, delivered, cancelled)
- Filter by payment status (pending, completed, failed, refunded)
- Sort by date, amount, status
- View order details with items
- Update order status
- Update payment status
- Delete orders

### API Endpoints
```
GET    /api/admin/orders                  - List all orders
GET    /api/admin/orders/:orderId         - Get order details
PUT    /api/admin/orders/:orderId/status  - Update order status
PUT    /api/admin/orders/:orderId/payment - Update payment status
DELETE /api/admin/orders/:orderId         - Delete order
```

---

## ⭐ Admin Review Management ✨

### Location
`frontend/src/pages/admin/adminpages/AdminReviews/AdminReviews.jsx`
Route: `/admin/reviews`

### Features
- Paginated review list with user and product info
- Filter by approval status (pending, approved)
- Sort by date, rating
- View/edit review details
- Approve/reject reviews
- Delete inappropriate reviews
- Rating breakdown by product (1-5 stars distribution)
- User hover modal with profile preview
- Click product name to filter AdminProducts

### API Endpoints
```
GET    /api/admin/reviews                              - List all reviews
GET    /api/admin/reviews/:reviewId                    - Get review details
PUT    /api/admin/reviews/:reviewId                    - Update review
PATCH  /api/admin/reviews/:reviewId/approve            - Approve review
DELETE /api/admin/reviews/:reviewId                    - Delete review
GET    /api/admin/reviews/product/:productId/breakdown - Rating breakdown
```

---

## 💝 Admin Wishlist Analytics ✨

### Location
`frontend/src/pages/admin/adminpages/AdminWishlists/AdminWishlists.jsx`
Route: `/admin/wishlists`

### Features
- Products sorted by wishlist count
- View users who wishlisted each product
- Click user to navigate to AdminUsers with filter
- Wishlist statistics overview
- Product popularity insights

### API Endpoints
```
GET    /api/admin/wishlists/stats              - Overall statistics
GET    /api/admin/wishlists/products           - Products with counts
GET    /api/admin/wishlists/:productId/users   - Users per product
GET    /api/admin/wishlists/:productId/count   - Count for product
DELETE /api/admin/wishlists/:productId/users/:userId - Remove item
```

---

## ⚙️ Admin Site Settings ✨

### Location
`frontend/src/pages/admin/adminpages/AdminSettings/AdminSettings.jsx`
Route: `/admin/settings`

### Features
- Maintenance mode control (off, site-wide, shop-only, registration-only)
- Custom maintenance message
- Feature toggles (registration, reviews, wishlist)
- General site configuration

### API Endpoints
```
GET    /api/admin/settings                    - Get all settings
GET    /api/admin/settings/:key               - Get single setting
PUT    /api/admin/settings/:key               - Update setting
PUT    /api/admin/settings                    - Update multiple
PUT    /api/admin/settings/maintenance        - Set maintenance mode
GET    /api/settings/maintenance              - Public: check status
```

---

## 🚚 Admin Freight Configuration ✨

### Location
Part of AdminSettings or dedicated freight section
Route: `/admin/settings` (Freight tab)

### Features
- Zone-based freight rates (8 zones)
- Free freight thresholds per zone type
- Local zone configuration (change from Tauranga)
- Supported countries management

### Freight Zones
1. **Local** - Configurable city (default: Tauranga, NZ)
2. **North Island** - NZ North Island
3. **South Island** - NZ South Island
4. **International North America** - USA, Canada
5. **International Europe** - UK, Portugal, EU
6. **International Asia** - China
7. **International Latin America** - Brazil
8. **International Africa** - African countries

### API Endpoints
```
GET    /api/admin/freight                     - Get freight config
PUT    /api/admin/freight                     - Update freight config
GET    /api/admin/freight/local-zone          - Get local zone
PUT    /api/admin/freight/local-zone          - Update local zone
GET    /api/admin/freight/available-cities    - NI cities list
GET    /api/freight/zones                     - Public: zone costs
POST   /api/freight/calculate                 - Calculate freight
```

---

## 👥 User Management

### User List Page

**Location:** `frontend/src/pages/admin/adminpages/AdminUsers/AdminUsers.jsx`
**Route:** `/admin/users`

**Features:**
- Paginated user list (20 per page)
- Search by name, email, or username
- Filter by role (user, admin, all)
- Filter by status (active, inactive, suspended)
- Sort by multiple fields
- Inline role/status updates
- View user details
- Delete users

**User Table Columns:**
| Column | Data | Actions |
|--------|------|---------|
| Email | user.email | - |
| Name | first_name + last_name | - |
| Role | user.role | Dropdown update |
| Status | user.status | Dropdown update |
| Created | created_at (formatted) | - |
| Actions | - | View, Delete |

**User Status Enum:**
- `active` - User can login and perform actions
- `inactive` - User exists but cannot login
- `suspended` - User temporarily blocked

**User Role Enum:**
- `user` - Regular user with shop access
- `admin` - Full administrative access

### API Endpoints

**GET /api/admin/users**
```javascript
// Query Parameters:
{
  page: 1,           // Page number (default: 1)
  limit: 20,         // Items per page (default: 20)
  search: "",        // Search term for name/email
  role: "all",       // Filter: "user", "admin", or "all"
  status: "all",     // Filter: "active", "inactive", "suspended", "all"
  sortBy: "user_id", // Sort field
  sortOrder: "desc"  // Sort order: "asc" or "desc"
}

// Response:
{
  success: true,
  data: [
    {
      user_id: "uuid",
      email: "user@example.com",
      first_name: "John",
      last_name: "Doe",
      username: "johndoe",
      phone: "021234567",
      role: "user",
      status: "active",
      avatar_url: "http://localhost:4000/uploads/avatars/...",
      created_at: "2025-01-15T10:30:00.000Z",
      updated_at: "2025-01-20T14:22:00.000Z"
    }
  ],
  pagination: {
    page: 1,
    limit: 20,
    total: 150,
    totalPages: 8
  }
}
```

**GET /api/admin/users/:userId**
```javascript
// Response: Single user object with all details
{
  success: true,
  data: {
    user_id: "uuid",
    email: "user@example.com",
    first_name: "John",
    last_name: "Doe",
    username: "johndoe",
    phone: "021234567",
    address: "123 Main Street",
    city: "Auckland",
    state: "Auckland",
    zipCode: "1010",
    country: "New Zealand",
    role: "user",
    status: "active",
    avatar_url: "http://localhost:4000/uploads/avatars/...",
    created_at: "2025-01-15T10:30:00.000Z",
    updated_at: "2025-01-20T14:22:00.000Z"
  }
}
```

**PATCH /api/admin/users/:userId/role**
```javascript
// Request Body:
{
  role: "admin"  // or "user"
}

// Response:
{
  success: true,
  message: "User role updated successfully",
  data: { /* updated user object */ }
}
```

**PATCH /api/admin/users/:userId/status**
```javascript
// Request Body:
{
  status: "suspended"  // or "active", "inactive"
}

// Response:
{
  success: true,
  message: "User status updated successfully",
  data: { /* updated user object */ }
}
```

**DELETE /api/admin/users/:userId**
```javascript
// Response:
{
  success: true,
  message: "User deleted successfully"
}
```

---

## 📦 Product Management

### Product List Page

**Location:** `frontend/src/pages/admin/adminpages/AdminProducts/AdminProducts.jsx`
**Route:** `/admin/products`

**Features:**
- Paginated product list (10 per page)
- Search by product name or SKU
- Filter by category
- Filter by active/inactive status
- Filter by featured status
- Sort by price, name, created date, view count
- Create new product
- Edit products
- Soft delete products
- View product details
- Bulk actions

### Product Form

**Location:** `frontend/src/pages/admin/adminpages/AdminProducts/AdminProductForm.jsx`
**Routes:** `/admin/products/new` (create), `/admin/products/edit/:id` (edit)

**Form Fields:**
- Product Name (required, text, max 255 chars)
- Product Slug (auto-generated or manual)
- Product Description (required, textarea, max 2000 chars)
- Category (required, dropdown)
- Brand (optional, text)
- Price (required, number, min 0.01)
- Sale Price (optional, number, less than price)
- SKU (required, unique, text, max 50 chars)
- Quantity Available (required, number, min 0)
- Is Featured (checkbox)
- Is Active (checkbox)
- Product Images (multiple upload, image files only)
- Tags (multiple select)

**Image Upload:**
- Accept: .jpg, .jpeg, .png only
- Max size: 5MB per image
- Auto-compress to appropriate resolution
- Display image preview
- Delete individual images
- Drag and drop support

**Tags System:**
- Multi-select dropdown
- Create new tags on the fly
- Add/remove tags during product creation/editing
- Search through available tags

### API Endpoints

**GET /api/admin/products**
```javascript
// Query Parameters:
{
  page: 1,
  limit: 10,
  search: "",        // Search by name or SKU
  category_id: null,
  is_active: null,   // true/false/null
  is_featured: null, // true/false/null
  sortBy: "created_at",
  sortOrder: "desc"
}

// Response:
{
  success: true,
  data: [
    {
      product_id: "uuid",
      product_name: "Product Name",
      product_description: "Description",
      slug: "product-name",
      price: "99.99",
      sale_price: "79.99",
      sku: "PROD-001",
      quantity_available: 50,
      category_id: "cat-uuid",
      category_name: "Category Name",
      brand: "Brand Name",
      is_featured: true,
      is_active: true,
      view_count: 150,
      rating_average: 4.5,
      rating_count: 28,
      primary_image: "path/to/image.jpg",
      created_at: "2025-01-01T00:00:00.000Z"
    }
  ],
  pagination: { page: 1, limit: 10, total: 245, totalPages: 25 }
}
```

**POST /api/admin/products**
```javascript
// Request Body (multipart/form-data):
{
  product_name: "New Product",
  product_description: "Description text",
  slug: "new-product",
  price: "99.99",
  sale_price: "79.99",
  sku: "PROD-NEW",
  quantity_available: 100,
  category_id: "cat-uuid",
  brand: "Brand",
  is_featured: false,
  is_active: true,
  images: [File, File, ...],  // Image files
  tags: ["tag-1", "tag-2"]    // Tag IDs
}

// Response:
{
  success: true,
  message: "Product created successfully",
  data: { /* created product object */ }
}
```

**PATCH /api/admin/products/:productId**
```javascript
// Request Body: Same as POST
// Response: Same as POST
```

**DELETE /api/admin/products/:productId**
```javascript
// Response:
{
  success: true,
  message: "Product deleted successfully"
}
```

**POST /api/admin/products/:productId/images**
```javascript
// Request Body (multipart/form-data):
{
  images: [File, File, ...]
}

// Response:
{
  success: true,
  message: "Images uploaded successfully",
  data: {
    images: [
      { image_id: "id", image_url: "path" }
    ]
  }
}
```

**DELETE /api/admin/products/:productId/images/:imageId**
```javascript
// Response:
{
  success: true,
  message: "Image deleted successfully"
}
```

---

## 📊 Statistics & Analytics

### Dashboard Statistics

**Location:** Backend service at `backend/src/services/adminStatsService.js`

**Available Metrics:**

```javascript
{
  totalUsers: 150,              // Total user accounts
  activeUsers: 120,             // Users with "active" status
  totalProducts: 245,           // Total product count
  activeProducts: 200,          // Products with is_active = true
  totalOrders: 380,             // Total orders placed
  pendingOrders: 25,            // Orders not yet completed
  completedOrders: 340,         // Successfully completed orders
  totalRevenue: 45680.50,       // Total sales amount
  averageOrderValue: 120.21,    // Average order amount
  monthlyRevenue: 8950.25       // Revenue this month
}
```

### API Endpoint

**GET /api/admin/stats**
```javascript
// Response:
{
  success: true,
  totalUsers: 150,
  activeUsers: 120,
  totalProducts: 245,
  activeProducts: 200,
  totalOrders: 380,
  pendingOrders: 25,
  completedOrders: 340,
  totalRevenue: "45680.50",
  averageOrderValue: "120.21",
  monthlyRevenue: "8950.25"
}
```

---

## 🔐 Authentication & Authorization

### Admin Middleware

All admin routes are protected by `requireAdmin` middleware:

```javascript
// Middleware check:
1. Verify user is authenticated
2. Verify user role is "admin"
3. If not admin, return 403 Forbidden
```

### Route Protection

**Protected Routes:**
- GET /api/admin/users
- GET /api/admin/users/:userId
- PATCH /api/admin/users/:userId/role
- PATCH /api/admin/users/:userId/status
- DELETE /api/admin/users/:userId
- GET /api/admin/products
- POST /api/admin/products
- PATCH /api/admin/products/:productId
- DELETE /api/admin/products/:productId
- GET /api/admin/stats

**Error Responses:**
```javascript
// If not authenticated:
{
  success: false,
  message: "Authentication required"
}
// Status: 401

// If not admin:
{
  success: false,
  message: "Admin access required"
}
// Status: 403
```

---

## 🎨 UI Components

### StatCard Component

**Location:** `frontend/src/pages/admin/components/StatCard.jsx`

**Props:**
```typescript
{
  label: string;        // Card title
  value: number|string; // Stat value
  icon?: string;        // Material icon name
  loading?: boolean;    // Show loading state
}
```

**Usage:**
```jsx
<StatCard 
  label="Total Users"
  value={150}
  icon="people"
  loading={isLoading}
/>
```

### ActionCard Component

**Location:** `frontend/src/pages/admin/components/ActionCard.jsx`

**Props:**
```typescript
{
  title: string;           // Card title
  description: string;     // Card description
  icon?: string;          // Material icon
  link: string;           // Navigation link
  action?: () => void;    // Click handler
}
```

**Usage:**
```jsx
<ActionCard
  title="Manage Users"
  description="View and edit user accounts"
  icon="people"
  link="/admin/users"
/>
```

### Admin Buttons

**Location:** `frontend/src/pages/admin/btn/`

**Available Buttons:**
- **AddBtn** - Create new item (primary action)
- **EditBtn** - Edit item (secondary action)
- **DeleteBtn** - Delete item (danger action)
- **SaveBtn** - Save changes (primary, form submit)
- **CancelBtn** - Cancel action (secondary)
- **ConfirmBtn** - Confirm action (primary, confirm dialog)
- **UploadBtn** - Upload files (secondary)

---

## 🧪 Common Admin Tasks

### Add a New User Role

1. Add role enum to database
2. Update constants in `adminMessages.js`
3. Update role filter dropdown in AdminUsers.jsx
4. Update role validation in `adminValidator.js`
5. Add role validation in backend middleware

### Create a New Admin Page

1. Create folder in `adminpages/`
2. Create main component (e.g., AdminFeature.jsx)
3. Create CSS module
4. Add constants file if needed
5. Add functions file for API calls
6. Add route in AdminLayout sidebar
7. Add backend routes and controllers

### Add a New Product Field

1. Create database migration to add column
2. Update Product model
3. Add form field in AdminProductForm.jsx
4. Update product validation
5. Add field to product list display
6. Update API endpoint to include field
7. Update backend service and controller

---

## 📱 User Experience Features

### Loading States
- Skeleton loaders on table during fetch
- Button loading spinners during submission
- Disabled form during submission

### Error Handling
- Toast notifications for errors
- User-friendly error messages
- Retry buttons for failed operations
- Network error handling

### Success Feedback
- Toast notifications for completed actions
- Success messages in modals
- Page redirects after successful creation/update
- Auto-refresh of affected data

### Responsive Design
- Desktop-optimized interface (1200px+)
- Tablet adjustments (768px-1199px)
- Mobile view warnings (< 768px)
- Horizontal scroll for tables on small screens

---

## 🔗 Related Documentation

- **[Authentication Flow](../flows/authentication-flow.md)** - Login and session management
- **[Profile Management Flow](../flows/profile-management-flow.md)** - User profile system
- **[Shop & Cart Flow](../flows/shop-cart-flow.md)** - Product and order system
- **[Sitemap](../sitemap.md)** - Complete documentation index

---

## 🧪 Testing Checklist

### User Management
- [ ] View paginated list of users
- [ ] Search users by email/name
- [ ] Filter by role and status
- [ ] Sort by different columns
- [ ] Update user role from user to admin
- [ ] Update user status (active/inactive/suspended)
- [ ] View user details in modal
- [ ] Delete user
- [ ] Deleted user cannot login
- [ ] Admin changes are reflected in real-time

### Product Management
- [ ] View paginated list of products
- [ ] Search products by name/SKU
- [ ] Filter by category, active, featured
- [ ] Sort by price/name/date/views
- [ ] Create new product with all fields
- [ ] Upload multiple product images
- [ ] Edit existing product
- [ ] Delete product (soft delete)
- [ ] Add/remove product tags
- [ ] Images display correctly on shop page
- [ ] Only active products show in shop

### Admin Authentication
- [ ] Regular users cannot access /admin
- [ ] Non-admin users get 403 error
- [ ] Admin users can access all pages
- [ ] Session timeout logs out admin
- [ ] Page refreshes maintain admin state
- [ ] Back button works correctly

### Statistics
- [ ] Dashboard stats load on page open
- [ ] Stats update after user/product changes
- [ ] Stats are accurate and current
- [ ] No XSS vulnerabilities in stat display

---

**Document Version:** 1.0  
**Last Updated:** December 29, 2025  
**Status:** ✅ Fully Implemented
