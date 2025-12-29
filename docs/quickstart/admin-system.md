///////////////////////////////////////////////////////////////////////
// =================== ADMIN SYSTEM DOCUMENTATION ==================== //
///////////////////////////////////////////////////////////////////////

/**
 * DOCUMENT PURPOSE:
 * Complete guide to the admin system including dashboard, user management,
 * product management, and all administrative features with backend API integration.
 * 
 * FEATURES: Admin Dashboard, User CRUD, Product CRUD, Stats, Role Management
 * LAST UPDATED: December 29, 2025
 * VERSION: 1.0
 */

---

## 📋 Overview

The **Admin System** provides comprehensive management capabilities for administrators to control users, products, categories, and view platform statistics. Features include:

- **Admin Dashboard** with real-time statistics and quick actions
- **User Management** with role/status control and filtering
- **Product Management** with CRUD operations and image uploads
- **Category Management** for organizing products
- **Statistics & Analytics** for platform metrics
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
│   ├── AdminOrders/                # Order management section
│   ├── AdminProducts/
│   │   ├── AdminProducts.jsx       # Product list page
│   │   ├── AdminProducts.module.css
│   │   ├── AdminProductForm.jsx    # Create/edit product form
│   │   └── AdminProductForm.module.css
│   └── AdminUsers/
│       ├── AdminUsers.jsx          # User list page
│       ├── AdminUsers.module.css
│       └── UserDetailsModal.jsx    # User detail view
│
├── btn/
│   ├── AddBtn.jsx                  # Add new item button
│   ├── EditBtn.jsx                 # Edit item button
│   ├── DeleteBtn.jsx               # Delete item button
│   ├── SaveBtn.jsx                 # Save changes button
│   ├── CancelBtn.jsx               # Cancel button
│   ├── ConfirmBtn.jsx              # Confirm action button
│   ├── UploadBtn.jsx               # Upload file button
│   └── AdminButtons.module.css
│
├── components/
│   ├── AdminLayout.jsx             # Admin page wrapper with sidebar
│   ├── AdminLayout.module.css
│   ├── AdminNavBar.jsx             # Admin navigation bar
│   ├── AdminNavBar.module.css
│   ├── StatCard.jsx                # Statistics display card
│   ├── StatCard.module.css
│   ├── ActionCard.jsx              # Quick action card
│   └── ActionCard.module.css
│
├── constants/
│   ├── adminConstants.js           # Admin-related constants
│   ├── adminErrorMessages.js       # Error message constants
│   └── adminSuccessMessages.js     # Success message constants
│
├── functions/
│   ├── fetchStats.js               # Fetch dashboard statistics
│   ├── getAllUsers.js              # Get users list
│   ├── getUserById.js              # Get single user
│   ├── updateUserRole.js           # Update user role
│   ├── updateUserStatus.js         # Update user status
│   ├── getAllProducts.js           # Get products list
│   ├── getProductById.js           # Get single product
│   ├── createProduct.js            # Create new product
│   ├── updateProduct.js            # Update product
│   ├── deleteProduct.js            # Delete product
│   ├── uploadProductImage.js       # Upload product image
│   ├── deleteProductImage.js       # Delete product image
│   ├── getProductTags.js           # Get product tags
│   ├── getAllTags.js               # Get all available tags
│   ├── addProductTag.js            # Add tag to product
│   ├── deleteProductTag.js         # Remove tag from product
│   └── addMultipleTags.js          # Add multiple tags
│
├── helpers/
│   ├── formatDateDMY.js            # Date formatting (DD/MM/YYYY)
│   ├── generateSKU.js              # Auto-generate product SKU
│   ├── getChangedProductFields.js  # Detect changed fields
│   └── sanitizeImagePath.js        # Sanitize image URLs
│
└── validators/
    ├── validateProduct.js          # Product form validation
    └── validateUserUpdate.js       # User update validation
```

### Backend

```
backend/src/
├── controllers/
│   ├── adminUserController.js      # User management endpoints
│   ├── adminProductController.js   # Product management endpoints
│   ├── adminCategoryController.js  # Category management endpoints
│   └── adminStatsController.js     # Statistics endpoints
│
├── services/
│   ├── adminUserService.js         # User business logic
│   ├── adminProductService.js      # Product business logic
│   ├── adminCategoryService.js     # Category business logic
│   └── adminStatsService.js        # Statistics business logic
│
├── model/
│   └── [Uses existing models]      # Users, Products, Categories
│
├── routes/
│   ├── adminUserRoutes.js          # User management routes
│   ├── adminProductRoutes.js       # Product management routes
│   ├── adminCategoryRoutes.js      # Category management routes
│   └── adminStatsRoutes.js         # Statistics routes
│
├── middleware/
│   ├── authMiddleware.js           # Authentication check
│   └── adminMiddleware.js          # Admin role verification
│
├── validators/
│   └── adminValidator.js           # Input validation for admin
│
├── helpers/
│   └── compressProductImage.js     # Image compression for products
│
└── constants/
    ├── adminMessages.js            # Admin-related messages
    └── errorMessages.js            # Error messages
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
- Total revenue metrics

**Quick Action Cards:**
- View all users
- Create new product
- View all products
- View all orders

**Layout:**
- Header with admin title
- Sidebar navigation
- Main content area with stats grid
- Responsive design

### Component Structure

```jsx
<AdminLayout>
  <h1>Admin Dashboard</h1>
  <StatCard 
    label="Total Users"
    value={stats.totalUsers}
    icon="people"
  />
  <StatCard 
    label="Total Products"
    value={stats.totalProducts}
    icon="shopping_bag"
  />
  {/* More stat cards */}
  <ActionCard 
    title="Manage Users"
    description="View and edit user accounts"
    link="/admin/users"
  />
  {/* More action cards */}
</AdminLayout>
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
