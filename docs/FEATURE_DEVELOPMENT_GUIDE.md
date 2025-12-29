---

# 📋 Feature Development Guide - Rating System & Admin Settings

**Document Purpose:** Quick reference for implementing rating system and admin settings  
**Last Updated:** December 29, 2025  
**Status:** Planning Phase

---

## 🌟 Rating System Implementation Guide

### Overview
A comprehensive product rating system allowing customers to rate and review products after delivery, with admin management capabilities.

### Key Requirements

#### Customer-Facing Features
1. **Email-Based Rating Links**
   - Automatically sent after product delivery
   - Unique link per order/product combination
   - Link expires after 30 days
   - Multiple products in one order = multiple rating links

2. **One Rating Per User Per Product**
   - Database constraint: UNIQUE(user_id, product_id)
   - Prevent duplicate ratings
   - Allow only one active rating per user per product

3. **Rating & Comment Edit Capability**
   - Users can edit their rating (1-5 stars)
   - Users can edit their comment/review text
   - Edit timestamp tracked and displayed
   - Show "Last edited: [date]" on rating display

4. **Rating Page Interface**
   - Star rating selector (1-5 stars)
   - Comment text area (optional, max 500 chars)
   - Photo upload (optional)
   - Submit button
   - Form validation

#### Admin Features
1. **Admin Rating Dashboard**
   - View all product ratings
   - Filter by product name/ID
   - Filter by rating score (1★, 2★, 3★, 4★, 5★)
   - Filter by user
   - Sort options (newest, highest, lowest, helpful)
   - Pagination (20 per page)

2. **Rating Statistics Card**
   - Average rating (e.g., 4.5/5)
   - Total number of reviews
   - Distribution chart (counts for each star level)
   - Percentage breakdown
   - Trend indicator (↑ up, ↓ down, → stable)

3. **Admin Moderation Tools**
   - View full rating with user info
   - Edit rating or comment (admin notes on edit)
   - Delete inappropriate ratings
   - Hide/unhide specific ratings
   - Mark as verified purchase

4. **Admin Shortcuts**
   - Dashboard widget: "Recent Reviews" (5 most recent)
   - Dashboard widget: "Average Rating" by product (top 5 products)
   - Quick link from admin menu to Ratings page
   - Product management quick link to product's ratings

5. **Rating Management Page Features**
   - Bulk actions (hide, delete, approve)
   - Export ratings to CSV
   - Search by product/user/date range
   - Real-time update notifications

### Database Schema

```sql
-- New table: ratings
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  score INT NOT NULL CHECK (score >= 1 AND score <= 5),
  comment TEXT CHECK (char_length(comment) <= 500),
  photo_url TEXT,
  
  verified_purchase BOOLEAN DEFAULT true,
  helpful_count INT DEFAULT 0,
  unhelpful_count INT DEFAULT 0,
  
  is_hidden BOOLEAN DEFAULT false,
  admin_notes TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
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

## 🔗 Integration Points

### Rating System Integration
- **Checkout Page:** After payment, order transitions to "Pending" (awaiting delivery)
- **Order Delivery:** When admin marks order as "Delivered", send rating email
- **Product Page:** Display average rating and review count
- **Profile Page:** Show user's own ratings
- **Admin Dashboard:** Show recent reviews widget

### Admin Settings Integration
- **Checkout Page:** Auto-select shipping tier based on address
- **Shop Page:** Show maintenance banner if shop maintenance enabled
- **Login Page:** Hide if full maintenance mode enabled (except admin)
- **Navigation:** Show maintenance alerts based on settings
- **Email:** Use configured SMTP for all notifications
- **Branding:** Apply custom colors from settings

---

**Note:** These are planning documents. Actual implementation may vary based on requirements and constraints.
