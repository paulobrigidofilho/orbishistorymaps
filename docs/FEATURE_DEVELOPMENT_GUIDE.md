---

# 📋 Feature Development Guide

**Document Purpose:** Quick reference for implementing core features and system architecture  
**Last Updated:** January 4, 2026  
**Status:** Active Development (paulo branch)

---

## ✅ Completed Features

### 🌟 Product Review System (IMPLEMENTED)

The product review system is now fully implemented using Sequelize ORM.

#### Database Model: ProductReview
```javascript
// backend/src/models/ProductReview.js
{
  review_id: STRING(36),      // UUID primary key
  product_id: STRING(36),     // FK to products
  user_id: STRING(64),        // FK to users
  order_id: STRING(36),       // FK to orders (optional)
  rating: INTEGER,            // 1-5 stars
  review_title: STRING(255),  // Optional title
  review_text: TEXT,          // Review content
  is_verified_purchase: BOOLEAN,
  is_approved: BOOLEAN,       // Admin moderation
  helpful_count: INTEGER,
  created_at, updated_at
}
```

#### API Endpoints (Implemented)
```
# User Review Endpoints
GET    /api/reviews/product/:productId    - Get product reviews (public)
POST   /api/reviews                        - Create/update review (auth required)
GET    /api/reviews/user/:userId           - Get user's reviews
PATCH  /api/reviews/:reviewId              - Edit review
DELETE /api/reviews/:reviewId              - Delete review

# Admin Review Endpoints
GET    /api/admin/reviews                  - Get all reviews with filters
GET    /api/admin/reviews/:reviewId        - Get single review
PUT    /api/admin/reviews/:reviewId        - Update review
PATCH  /api/admin/reviews/:reviewId/approve - Approve review
DELETE /api/admin/reviews/:reviewId        - Delete review
GET    /api/admin/reviews/product/:productId/breakdown - Rating breakdown
```

#### Implementation Files
- `backend/src/models/ProductReview.js` - Sequelize model
- `backend/src/controllers/reviewController.js` - User review controller
- `backend/src/controllers/adminReviewController.js` - Admin controller
- `backend/src/services/reviewService.js` - Business logic
- `backend/src/services/adminReviewService.js` - Admin service
- `backend/src/routes/reviewRoutes.js` - User routes
- `backend/src/routes/adminReviewRoutes.js` - Admin routes
- `frontend/src/pages/admin/adminpages/AdminReviews/` - Admin UI

---

### ⚙️ Admin Settings System (IMPLEMENTED)

Site-wide configuration management with maintenance mode support.

#### Database Model: SiteSettings
```javascript
// backend/src/models/SiteSettings.js
{
  setting_id: INTEGER,
  setting_key: STRING(100),      // Unique key
  setting_value: TEXT,           // JSON-compatible value
  setting_type: ENUM('string', 'number', 'boolean', 'json'),
  setting_description: STRING(255),
  setting_category: STRING(50),  // 'maintenance', 'store', 'features'
  created_at, updated_at
}
```

#### Static Methods
- `SiteSettings.getSetting(key)` - Get typed value
- `SiteSettings.setSetting(key, value, options)` - Create/update setting
- `SiteSettings.getAllForCategory(category)` - Get category settings
- `SiteSettings.getAllAsObject()` - Get all as key-value object

#### API Endpoints (Implemented)
```
# Public
GET    /api/settings/maintenance           - Get maintenance status

# Admin
GET    /api/admin/settings                 - Get all settings
GET    /api/admin/settings/:key            - Get single setting
PUT    /api/admin/settings/:key            - Update setting
PUT    /api/admin/settings                 - Update multiple settings
PUT    /api/admin/settings/maintenance     - Set maintenance mode
POST   /api/admin/settings/initialize      - Initialize defaults
GET    /api/admin/settings/category/:cat   - Get by category
```

#### Maintenance Mode Options
- `off` - Normal operation
- `site-wide` - Entire site disabled
- `shop-only` - Shop features disabled
- `registration-only` - New registrations disabled

---

### 🚚 Freight Zone System (IMPLEMENTED)

Zone-based shipping cost calculation with configurable local zone.

#### Database Model: FreightConfig
```javascript
// backend/src/models/FreightConfig.js
{
  config_id: UUID,
  // Zone costs
  local: DECIMAL,              // Tauranga (default)
  north_island: DECIMAL,       // NZ North Island
  south_island: DECIMAL,       // NZ South Island
  rural_surcharge: DECIMAL,
  intl_north_america: DECIMAL,
  intl_asia: DECIMAL,
  intl_europe: DECIMAL,
  intl_africa: DECIMAL,
  intl_latin_america: DECIMAL,
  // Free freight
  is_free_freight_enabled: BOOLEAN,
  threshold_local: DECIMAL,
  threshold_national: DECIMAL,
  threshold_international: DECIMAL,
  // Local zone config
  local_zone_city: STRING,     // "Tauranga"
  local_zone_region: STRING,   // "Bay of Plenty"
  local_zone_postal_prefixes: STRING,
  local_zone_suburbs: TEXT
}
```

#### API Endpoints (Implemented)
```
# Admin
GET    /api/admin/freight                  - Get freight config
PUT    /api/admin/freight                  - Update freight config
GET    /api/admin/freight/local-zone       - Get local zone config
PUT    /api/admin/freight/local-zone       - Update local zone
GET    /api/admin/freight/available-cities - Get NI cities

# Public
GET    /api/freight/config                 - Public freight config
GET    /api/freight/zones                  - Get zone costs
POST   /api/freight/calculate              - Calculate freight cost
POST   /api/freight/calculate-from-address - Calculate from address
GET    /api/freight/zones-info             - Get zones information
POST   /api/freight/validate-address       - Validate shipping address
GET    /api/freight/supported-countries    - Get country list
```

#### Zone Detection Logic
The `zoneDetectionHelper.js` provides:
- NZ city-to-island mapping (100+ cities)
- International country-to-zone mapping
- Postal code prefix detection
- Suburb matching for local zone

---

### 💝 Admin Wishlist Management (IMPLEMENTED)

View and manage product wishlists with user details.

#### API Endpoints (Implemented)
```
GET    /api/admin/wishlists/stats          - Overall statistics
GET    /api/admin/wishlists/products       - Products with wishlist counts
GET    /api/admin/wishlists/:productId/users - Users who wishlisted product
GET    /api/admin/wishlists/:productId/count - Wishlist count for product
DELETE /api/admin/wishlists/:productId/users/:userId - Remove from wishlist
```

#### Frontend Components
- `AdminWishlists.jsx` - Main wishlist management page
- `WishlistModal.jsx` - Modal showing users per product

---

### 📦 Admin Order Management (IMPLEMENTED)

Full order lifecycle management with status tracking.

#### API Endpoints (Implemented)
```
GET    /api/admin/orders                   - Get all orders (paginated)
GET    /api/admin/orders/:orderId          - Get order details
PUT    /api/admin/orders/:orderId/status   - Update order status
PUT    /api/admin/orders/:orderId/payment  - Update payment status
DELETE /api/admin/orders/:orderId          - Delete order
```

#### Order Statuses
- `pending` → `processing` → `shipped` → `delivered`
- `cancelled`, `refunded`

#### Payment Statuses
- `pending`, `completed`, `failed`, `refunded`

---

## 🔮 Upcoming Implementation Guide
  
  UNIQUE(user_id, product_id),
  INDEX idx_product_id (product_id),
  INDEX idx_user_id (user_id),
  INDEX idx_score (score),
  INDEX idx_created_at (created_at)
);

-- New table: rating_edit_history
CREATE TABLE rating_edit_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rating_id UUID NOT NULL REFERENCES ratings(id) ON DELETE CASCADE,
  old_score INT,
  new_score INT,
  old_comment TEXT,
  new_comment TEXT,
  edited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key to orders table
ALTER TABLE orders ADD COLUMN rating_email_sent BOOLEAN DEFAULT false;
ALTER TABLE orders ADD COLUMN rating_email_sent_at TIMESTAMP;
```

### API Endpoints

```
# Get product ratings
GET /api/products/:productId/ratings
  Query: ?page=1&limit=20&sort=newest&filter=5stars
  Response: { ratings: [...], total, average, distribution }

# Submit rating (after delivery)
POST /api/ratings
  Body: { orderId, productId, score, comment, photo }
  Auth: Required
  
# Update rating
PATCH /api/ratings/:ratingId
  Body: { score, comment }
  Auth: Required (owner or admin)

# Delete rating
DELETE /api/ratings/:ratingId
  Auth: Required (owner or admin)

# Admin: Get all ratings
GET /api/admin/ratings
  Query: ?product=uuid&score=5&user=uuid&page=1
  Auth: Required (admin)
  
# Admin: Moderate rating
PATCH /api/admin/ratings/:ratingId
  Body: { action: 'hide'|'unhide'|'edit', data: {...} }
  Auth: Required (admin)

# Admin: Get rating statistics
GET /api/admin/ratings/stats
  Query: ?timeframe=30days|all
  Response: { average, total, distribution, trending }
```

### Implementation Checklist

- [ ] Create ratings table with schema
- [ ] Create rating_edit_history table
- [ ] Build Rating submission form component
- [ ] Add rating link generation after delivery
- [ ] Build Admin Rating Dashboard page
- [ ] Create Rating statistics card
- [ ] Implement rating moderation tools
- [ ] Add rating display on product pages
- [ ] Create admin shortcuts/widgets
- [ ] Add email notification for rating links
- [ ] Implement rating editing functionality
- [ ] Add testing for rating constraints
- [ ] Documentation & API docs

---

## ⚙️ Admin Settings Implementation Guide

### Overview
Comprehensive admin settings interface for controlling app behavior, regional configuration, and system maintenance.

### Key Sections

#### 1. Shipping & Freight Settings

**8-Tier Regional System:**
1. **Local** - Tauranga, New Zealand
   - Covers: Tauranga CBD and immediate surroundings
   - Default rate: NZD $5.00
   - Delivery: 1-2 business days

2. **National (North Island)** - New Zealand North Island
   - Covers: All NI postal codes (0000-5999)
   - Default rate: NZD $12.00
   - Delivery: 2-4 business days

3. **National (South Island)** - New Zealand South Island
   - Covers: All SI postal codes (7000-9999)
   - Default rate: NZD $18.00
   - Delivery: 3-5 business days

4. **International (North America)** - USA & Canada
   - Default rate: NZD $45.00
   - Delivery: 7-14 business days

5. **International (Europe)** - EU & UK
   - Default rate: NZD $48.00
   - Delivery: 10-21 business days

6. **International (Asia & Oceania)** - Asia, Australia, Pacific
   - Default rate: NZD $40.00
   - Delivery: 7-14 business days

7. **International (South & Central America)** - South/Central America
   - Default rate: NZD $50.00
   - Delivery: 10-21 business days

8. **International (Africa)** - African continent
   - Default rate: NZD $55.00
   - Delivery: 14-28 business days

**Admin Controls:**
- [ ] View all tiers with current rates
- [ ] Edit tier names/descriptions
- [ ] Update shipping costs
- [ ] Set handling fees
- [ ] Bulk import rates (CSV)
- [ ] Set estimated delivery times
- [ ] Enable/disable tiers

#### 2. Regional Configuration

**Database Schema:**
```sql
CREATE TABLE shipping_tiers (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  region_code VARCHAR(20) UNIQUE NOT NULL,
  base_rate DECIMAL(10, 2),
  handling_fee DECIMAL(10, 2) DEFAULT 0,
  estimated_days_min INT,
  estimated_days_max INT,
  enabled BOOLEAN DEFAULT true,
  postal_codes TEXT[], -- Array of postal code ranges
  countries TEXT[], -- Array of country codes
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE shipping_tier_mapping (
  id UUID PRIMARY KEY,
  postal_code_start VARCHAR(10),
  postal_code_end VARCHAR(10),
  country_code VARCHAR(2),
  tier_id UUID REFERENCES shipping_tiers(id),
  INDEX idx_postal (postal_code_start, postal_code_end),
  INDEX idx_country (country_code)
);

CREATE TABLE regional_settings (
  id UUID PRIMARY KEY,
  region_name VARCHAR(100),
  default_tier_id UUID REFERENCES shipping_tiers(id),
  tax_rate DECIMAL(5, 2),
  currency VARCHAR(3) DEFAULT 'NZD',
  display_name VARCHAR(100),
  enabled BOOLEAN DEFAULT true
);
```

**Admin Controls:**
- [ ] Define regions and tier assignments
- [ ] Set tax rates by region
- [ ] Map postal codes to tiers
- [ ] Set default currency per region
- [ ] Enable/disable regions

#### 3. Application Settings

**Maintenance Modes:**

1. **Full App Maintenance Mode**
   - Disables entire application
   - Shows custom maintenance page
   - Exempt: Admin login page
   - Configuration:
     - [ ] Toggle maintenance mode on/off
     - [ ] Set maintenance message
     - [ ] Schedule maintenance window
     - [ ] Show countdown timer

2. **Shop Maintenance Mode**
   - Disables shop features only
   - Home, Gallery, About pages available
   - Users can't browse/buy
   - Shows maintenance banner
   - Configuration:
     - [ ] Toggle shop maintenance
     - [ ] Customize shop closure message

**User Registration Control:**
- [ ] Enable/disable new registrations
- [ ] Set registration deadline (date/time)
- [ ] Require referral code (optional)
- [ ] Limit registrations per IP
- [ ] Require email verification

**System Notifications:**
- [ ] Global announcement banner
- [ ] Maintenance alerts
- [ ] System status messages
- [ ] Scheduled notifications
- [ ] Configuration:
  - [ ] Create/edit announcements
  - [ ] Set display duration
  - [ ] Target specific user groups
  - [ ] Set priority level

**Email Configuration:**
- [ ] SMTP server settings
- [ ] Email authentication
- [ ] From email address
- [ ] Test email sending
- [ ] Email templates:
  - [ ] Welcome email
  - [ ] Password reset
  - [ ] Order confirmation
  - [ ] Shipping notification
  - [ ] Rating invitation

**Theme & Branding:**
- [ ] Primary color picker (#D4AF37)
- [ ] Secondary color picker (#1a1a1a)
- [ ] Logo upload
- [ ] Favicon upload
- [ ] Brand name
- [ ] Site title
- [ ] Meta description

#### 4. Database Schema

```sql
CREATE TABLE admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  description TEXT,
  category VARCHAR(50), -- 'shipping', 'maintenance', 'email', 'branding'
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by UUID REFERENCES users(id),
  
  INDEX idx_category (category),
  INDEX idx_key (setting_key)
);

-- Example records:
-- { setting_key: 'maintenance_mode_full', setting_value: { enabled: false }, category: 'maintenance' }
-- { setting_key: 'maintenance_message', setting_value: { text: 'We are updating...' }, category: 'maintenance' }
-- { setting_key: 'shop_maintenance', setting_value: { enabled: false }, category: 'maintenance' }
-- { setting_key: 'registration_enabled', setting_value: { enabled: true }, category: 'user' }
-- { setting_key: 'primary_color', setting_value: { hex: '#D4AF37' }, category: 'branding' }
-- { setting_key: 'smtp_settings', setting_value: { host, port, user, from }, category: 'email' }
```

### Implementation Checklist

**Phase 1: Shipping Tiers**
- [ ] Create shipping_tiers table
- [ ] Create shipping_tier_mapping table
- [ ] Build tier management UI
- [ ] Implement tier selection logic
- [ ] Add API endpoints for tier management
- [ ] Integrate with checkout (auto-select tier)

**Phase 2: Maintenance & Registration**
- [ ] Create admin_settings table
- [ ] Build maintenance mode controls
- [ ] Implement shop maintenance
- [ ] Build registration control panel
- [ ] Create maintenance page UI
- [ ] Add registration toggle

**Phase 3: System Notifications & Email**
- [ ] Build notification system
- [ ] Create email template manager
- [ ] Implement SMTP configuration UI
- [ ] Add email testing feature
- [ ] Build notification banner component
- [ ] Set up scheduled notifications

**Phase 4: Branding & Theme**
- [ ] Build color picker interface
- [ ] Logo upload functionality
- [ ] Favicon upload functionality
- [ ] Theme customization UI
- [ ] Apply custom colors throughout app
- [ ] Save brand settings

### API Endpoints

```
# Admin Settings CRUD
GET /api/admin/settings/:category
POST /api/admin/settings
PATCH /api/admin/settings/:key
DELETE /api/admin/settings/:key

# Shipping Tiers
GET /api/admin/shipping-tiers
POST /api/admin/shipping-tiers
PATCH /api/admin/shipping-tiers/:tierId
DELETE /api/admin/shipping-tiers/:tierId

# Maintenance Mode
PATCH /api/admin/settings/maintenance/toggle
GET /api/admin/settings/maintenance/status

# Registration Control
PATCH /api/admin/settings/registration
GET /api/admin/settings/registration/status

# Email Configuration
GET /api/admin/settings/email
PATCH /api/admin/settings/email
POST /api/admin/settings/email/test

# Theme/Branding
GET /api/admin/settings/branding
PATCH /api/admin/settings/branding
POST /api/admin/settings/branding/logo
```

---

## � Upcoming Implementation Guide

### Priority 1: Dummy Payment Method

#### Implementation Plan
```javascript
// backend/src/models/Payment.js (exists)
// Add dummy gateway integration

// Simulated payment flow:
// 1. User submits payment form with test card
// 2. Backend validates card format (not real validation)
// 3. Simulate processing delay (1-2 seconds)
// 4. Return success/failure based on card number
```

#### Test Card Numbers
- `4111111111111111` - Always succeeds
- `4000000000000002` - Always fails
- `4000000000000010` - Random success/failure

#### Required Files
- `backend/src/services/paymentService.js` - Payment processing
- `backend/src/controllers/paymentController.js` - Endpoints
- `frontend/src/pages/checkout/PaymentForm.jsx` - Payment UI
- `frontend/src/pages/checkout/OrderConfirmation.jsx` - Confirmation

---

### Priority 2: Order Simulation Engine

#### Implementation Plan
```javascript
// backend/src/services/orderSimulationService.js
const simulateOrderProgress = async (orderId, config) => {
  // Config: { delayMinutes, autoProgress }
  // Pending -> Processing: 5 min
  // Processing -> Shipped: 30 min
  // Shipped -> Delivered: 2 hours
};
```

#### Admin Controls
- Manual status change buttons
- Auto-simulation toggle
- Configurable delays per stage
- Bulk simulation for testing

---

### Priority 3: Email Integration

#### Required Setup
1. Configure SMTP in admin settings
2. Create email templates (Handlebars/EJS)
3. Implement email queue service

#### Email Templates Needed
- `welcome.html` - New user registration
- `password-reset.html` - Password reset link
- `order-confirmation.html` - Order placed
- `order-shipped.html` - Order shipped
- `rating-request.html` - Post-delivery rating

---

### Priority 4: Design System

#### CSS Variables Structure
```css
:root {
  /* Colors */
  --color-primary: #D4AF37;      /* Gold */
  --color-secondary: #1a1a1a;    /* Black */
  --color-background: #ffffff;
  --color-surface: #f9fafb;
  --color-error: #dc2626;
  --color-success: #059669;
  
  /* Typography */
  --font-family: 'Inter', sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Borders */
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 12px;
}
```

---

### Priority 5: Admin Posts System

#### Database Model
```javascript
// backend/src/models/Post.js
{
  post_id: UUID,
  title: STRING(255),
  slug: STRING(300),
  content: TEXT,           // Markdown content
  excerpt: STRING(500),    // Preview text
  featured_image: STRING,
  author_id: FK(users),
  status: ENUM('draft', 'published'),
  published_at: DATE,
  created_at, updated_at
}
```

#### Admin Interface
- Post list with status filter
- Markdown editor (react-markdown-editor-lite)
- Image upload for featured image
- Publish/unpublish toggle
- Schedule publishing

---

### Priority 6: Error Pages

#### Component Structure
```jsx
// frontend/src/pages/errors/
├── Error404.jsx      // Not Found
├── Error403.jsx      // Forbidden
├── Error500.jsx      // Server Error
├── Error503.jsx      // Maintenance
└── ErrorBoundary.jsx // Catch-all wrapper
```

#### Features
- Consistent branding (gold/black theme)
- Helpful navigation (Home, Back, Search)
- Contact support link
- Automatic error logging

---

## 📁 Architecture Reference

### Backend Directory (Sequelize ORM)
```
backend/src/
├── config/
│   ├── config.js              # DB pool (legacy)
│   └── sequelizeConfig.js     # Sequelize instance ✨
├── models/                     # Sequelize models ✨
│   ├── index.js               # Model associations
│   ├── User.js
│   ├── Product.js
│   ├── ProductReview.js
│   ├── Order.js
│   ├── SiteSettings.js
│   ├── FreightConfig.js
│   └── ...
├── controllers/
├── services/
├── routes/
├── middleware/
└── helpers/
    └── zoneDetectionHelper.js # NZ zone detection ✨
```

### Frontend Admin Structure
```
frontend/src/pages/admin/
├── AdminDashboard.jsx
├── adminpages/
│   ├── AdminUsers/
│   ├── AdminProducts/
│   ├── AdminOrders/           ✨
│   ├── AdminReviews/          ✨
│   ├── AdminWishlists/        ✨
│   └── AdminSettings/         ✨
├── components/
│   ├── AdminManagementView.jsx  ✨ Template component
│   ├── AdminSearchBar.jsx       ✨
│   ├── AdminNavBar.jsx
│   └── ...
├── constants/
│   ├── adminSearchBarConstants.js ✨
│   ├── adminNavBarConstants.js    ✨
│   └── ...
└── btn/
    └── index.js               # Reusable buttons ✨
```

---

**Note:** ✨ = New/Updated in paulo branch (Dec 2025 - Jan 2026)
