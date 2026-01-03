# Future Enhancements & Development Roadmap

This document outlines planned features, completed work, and improvements for the Orbis project.

**Last Updated:** January 4, 2026  
**Current Phase:** Active Development  
**Branch:** paulo

---

## ✅ Recently Completed (December 2025 - January 2026)

### Backend Migration to Sequelize ORM
- [x] **Sequelize Configuration** - Centralized ORM setup with connection pooling
- [x] **Model Definitions** - Complete Sequelize models for all entities:
  - User, Product, ProductCategory, ProductImage, ProductTag
  - Order, OrderItem, Cart, CartItem
  - Wishlist, ProductReview, Inventory
  - Address, Payment, PasswordReset
  - SiteSettings, FreightConfig
- [x] **Model Associations** - Proper foreign key relationships and eager loading
- [x] **Service Layer Refactoring** - Controllers migrated from raw SQL to Sequelize
- Status: ✅ Complete

### Admin Dashboard Enhancements
- [x] **Admin Order Management** - Full CRUD with status/payment management
- [x] **Admin Review Management** - View, moderate, approve/reject reviews with rating breakdowns
- [x] **Admin Wishlist Management** - View products with wishlist counts, see users per product
- [x] **Admin Settings Page** - Maintenance mode, site configuration
- [x] **Admin Freight Zone Management** - Configure shipping rates by zone
- [x] **Reusable AdminManagementView** - Template component for all admin pages
- [x] **AdminSearchBar System** - Unified search with type-specific filters
- [x] **User Details Hover Modal** - Hover-triggered user info display in reviews
- [x] **Cross-Page Navigation** - URL search params for deep linking between admin pages
- Status: ✅ Complete

### Product Review System
- [x] **User Review CRUD** - Create, read, update, delete reviews
- [x] **One Rating Per User Per Product** - Database constraint enforced
- [x] **Rating Breakdown** - 5-star distribution statistics per product
- [x] **Admin Review Moderation** - Approve, edit, delete reviews
- [x] **Product Rating Aggregation** - Auto-update average ratings
- Status: ✅ Complete

### Freight & Shipping Configuration
- [x] **Zone-Based Freight System** - 8-tier regional shipping:
  - Local (Tauranga, NZ) - Configurable city
  - North Island (NZ)
  - South Island (NZ)
  - International: North America, Europe, Asia, Latin America, Africa
- [x] **Free Freight Thresholds** - Configurable per zone type
- [x] **Local Zone Configuration** - Admin can change local city/suburbs
- [x] **Address-Based Zone Detection** - Auto-detect freight zone from address
- [x] **Zone Detection Helper** - NZ city-to-region mapping with 100+ cities
- Status: ✅ Complete

### Regional & Localization Updates
- [x] **Default Currency: NZD** - Standardized across all displays
- [x] **PriceDisplay Component** - NZ flag + formatted NZD prices
- [x] **Country Field** - Added to user registration and profile
- [x] **CountrySelect Component** - Dropdown with supported countries
- [x] **SmartAddressInput** - Address autocomplete integration ready
- Status: ✅ Complete

### Component Refactoring & Architecture
- [x] **Reusable Button Components** - AddBtn, EditBtn, DeleteBtn, ViewBtn, CloseBtn
- [x] **Admin Constants System** - NavBar, StatCard, ActionCard, SearchBar configs
- [x] **Helper Functions** - formatDateDMY, formatNZD, sanitizeImagePath
- [x] **Error/Success Message Constants** - Centralized messaging
- Status: ✅ Complete

---

## 🎯 Priority Roadmap (Q1-Q2 2026)

### Priority 1: Order Process Completion
**Objective:** Implement dummy payment method and complete checkout flow

- [ ] **Dummy Payment Gateway** - Simulated payment processing
  - Success/failure simulation modes
  - Card validation UI (test numbers)
  - Payment confirmation page
- [ ] **Checkout Flow Completion**
  - Address selection from saved addresses
  - Freight calculation at checkout
  - Order summary with totals
  - Payment processing integration
- [ ] **Order Confirmation**
  - Confirmation page with order details
  - Order number generation
  - Receipt download (PDF)
- **Estimated Effort:** 2-3 weeks
- **Priority:** 🔴 Critical

### Priority 2: Order Simulation Engine
**Objective:** Backend engine to simulate order lifecycle events

- [ ] **Order Status Workflow Engine**
  - Pending → Processing → Shipped → Delivered → Completed
  - Configurable delays between stages
  - Manual and automatic progression
- [ ] **Simulation Dashboard**
  - Admin interface to trigger status changes
  - Bulk order simulation
  - Delivery date estimation
- [ ] **Event Logging**
  - Order history timeline
  - Status change timestamps
  - Tracking number generation (simulated)
- **Estimated Effort:** 1-2 weeks
- **Priority:** 🔴 Critical

### Priority 3: Automated Email Flows
**Objective:** Integration of automated email triggers for key events

- [ ] **Password Reset Emails**
  - Reset link generation
  - Expiration handling
  - Template customization
- [ ] **Inquiry/Contact Emails**
  - Contact form submission notifications
  - Admin notification emails
- [ ] **Order Confirmation Emails**
  - Order placed confirmation
  - Order shipped notification
  - Delivery confirmation
- [ ] **Post-Purchase Rating Requests**
  - Automated email after delivery
  - Direct link to product rating page
  - Reminder emails
- [ ] **SMTP Configuration**
  - Admin-configurable SMTP settings
  - Email template management
  - Test email functionality
- **Estimated Effort:** 2-3 weeks
- **Priority:** 🟠 High

### Priority 4: Design System & Global Style Dictionary
**Objective:** Establish core design system for universal UI consistency

- [ ] **CSS Variables Centralization**
  - Color palette (gold/black theme)
  - Typography scale
  - Spacing system
  - Border radius tokens
  - Shadow definitions
- [ ] **Component Library Documentation**
  - Button variants and states
  - Form input styles
  - Card components
  - Modal patterns
- [ ] **Theme Configuration**
  - Light/dark mode support (future)
  - Admin theme customization
  - Brand color management
- [ ] **Global Styles**
  - Reset/normalize CSS
  - Utility classes
  - Responsive breakpoints
- **Estimated Effort:** 1-2 weeks
- **Priority:** 🟠 High

### Priority 5: Admin Posts & Content Management
**Objective:** Blog/news system with admin content management

- [ ] **Frontend: Homepage Posts Section**
  - Display 3 newest posts
  - Pagination for older content
  - Post preview cards
  - "Read More" navigation
- [ ] **Admin Dashboard: Posts Management**
  - Create/Edit/Delete posts
  - Markdown editor support
  - Image upload for posts
  - Post scheduling (publish date)
  - Draft/Published status
- [ ] **Post Model & API**
  - Post database schema
  - CRUD endpoints
  - Image storage handling
  - SEO metadata fields
- **Estimated Effort:** 2-3 weeks
- **Priority:** 🟡 Medium

### Priority 6: Standardized Error Handling
**Objective:** Uniform error pages across the application

- [ ] **Error Page Components**
  - 404 Not Found - Custom design
  - 500 Server Error - User-friendly message
  - 403 Forbidden - Access denied page
  - 503 Maintenance - Service unavailable
- [ ] **Error Boundary Implementation**
  - React error boundaries
  - Graceful error recovery
  - Error logging integration
- [ ] **User Experience**
  - Helpful navigation options
  - "Go Home" / "Go Back" buttons
  - Contact support links
  - Search functionality on 404
- **Estimated Effort:** 1 week
- **Priority:** 🟡 Medium

---

## 📦 Phase 2 - Enhanced E-Commerce (Q2 2026)

### Page Development & UI Completion
- [ ] **Gallery Page** - Interactive map gallery
  - [ ] Gallery grid layout with product images
  - [ ] Image carousel with fullscreen view
  - [ ] Historical information display
  - [ ] Interactive map integration (Google Maps API)
- [ ] **Home Page** - Landing page enhancement
  - [ ] Hero section with featured products
  - [ ] Featured products carousel
  - [ ] **Blog Posts Section** - 3 newest posts (Priority 5)
  - [ ] Newsletter signup
- [ ] **About Us Page** - Company information
  - [ ] Company mission and values
  - [ ] Team member profiles
  - [ ] Google Maps location embed
- Status: ~20% complete

### Shopping Flow Enhancement
- [ ] **Cart Persistence** - Maintain cart across sessions ✅ (partially done)
- [ ] **Saved Carts** - Allow users to save multiple carts
- [ ] **Quick Checkout** - One-click checkout for returning customers
- [ ] **Order Tracking** - Real-time order status and tracking
- [ ] **Reorder Functionality** - Quickly reorder previous items
- [ ] Status: ~50% complete

### Product Wishlist
- [ ] **Add to Wishlist** - Save products for later ✅ (partially done)
- [ ] **Wishlist Page** - View all saved items ✅ (partially done)
- [ ] **Share Wishlist** - Generate shareable wishlist links
- [ ] **Price Alerts** - Notify when wishlist items go on sale
- [ ] **Move to Cart** - Bulk add wishlist items to cart
- [ ] Status: ~60% complete

### Product Discovery
- [ ] **Advanced Filtering** - Multiple filter options
- [ ] **Product Comparison** - Compare 2-3 products side by side
- [ ] **Related Products** - Show related items on product page
- [ ] **Recently Viewed** - Track and display browse history
- [ ] **Smart Recommendations** - AI-based product suggestions
- [ ] Status: Not started

---

## 👥 Phase 5 - User Features & Community (Q3 2026)

### Profile Enhancements
- [ ] **Multiple Addresses** - Save multiple delivery addresses
- [ ] **Default Address** - Set primary delivery address
- [ ] **Address Nicknames** - Label addresses (Home, Work, etc.)
- [ ] **Privacy Settings** - Control data visibility
- [ ] **Notification Preferences** - Email/SMS notification controls
- [ ] **Public Profiles** - Optional user profile pages
- [ ] Status: ~20% complete

### Social Features
- [ ] **Product Sharing** - Share on social media
- [ ] **User Reviews** - Written product reviews with photos
- [ ] **Helpful Votes** - Like/dislike review functionality
- [ ] **Product Q&A** - Community Q&A section
- [ ] **Community Forums** - Discussion boards
- [ ] **Referral Program** - Share and earn rewards
- [ ] Status: Not started

### Loyalty & Rewards
- [ ] **Points System** - Earn points on purchases
- [ ] **Tier Rewards** - VIP tiers with exclusive benefits
- [ ] **Gift Cards** - Purchase and redeem gift cards
- [ ] **Coupons & Discounts** - Apply promo codes
- [ ] **Birthday Rewards** - Special offers on birthdays
- [ ] Status: Not started

---

## 🧪 Phase 6 - Testing & Quality Assurance (Q3 2026)

### Automated Testing
- [ ] **Unit Tests** - Jest for components and utilities
- [ ] **Integration Tests** - Backend API testing
- [ ] **E2E Tests** - Cypress for user flows
- [ ] **Load Testing** - Performance under stress
- [ ] **Security Testing** - Penetration testing
- [ ] Status: ~10% complete

### Manual Testing
- [ ] **Browser Compatibility** - Test across browsers
- [ ] **Device Testing** - Mobile, tablet, desktop
- [ ] **Accessibility Testing** - WCAG compliance
- [ ] **Usability Testing** - User feedback and iteration
- [ ] **Regression Testing** - Verify fixes don't break features
- [ ] Status: Ongoing

---

## 🚀 Phase 7 - Performance & DevOps (Q4 2026)

### Performance Optimization
- [ ] **Image Optimization** - Compression and lazy loading
- [ ] **Code Splitting** - Split bundles by route
- [ ] **Caching Strategy** - Browser and server caching
- [ ] **CDN Integration** - Content delivery network
- [ ] **Database Optimization** - Query optimization and indexing
- [ ] **Monitoring** - Performance metrics and alerts
- [ ] Status: ~20% complete

### DevOps & Deployment
- [ ] **CI/CD Pipeline** - Automated testing and deployment
- [ ] **Automated Deployments** - Push to staging and production
- [ ] **Container Management** - Docker optimization
- [ ] **Monitoring & Logging** - Error tracking and analytics
- [ ] **Backup Strategy** - Automated database backups
- [ ] **Disaster Recovery** - Failover and recovery procedures
- [ ] Status: ~30% complete

---

## 🔒 Security & Compliance (Ongoing)

### Security Enhancements
- [ ] **Two-Factor Authentication** - Optional 2FA for accounts
- [ ] **Rate Limiting** - Prevent brute force attacks
- [ ] **HTTPS Enforcement** - SSL/TLS for all traffic
- [ ] **CORS Security** - Proper CORS configuration
- [ ] **Input Validation** - Comprehensive validation
- [ ] **SQL Injection Prevention** - Parameterized queries
- [ ] Status: ~70% complete

### Compliance
- [ ] **GDPR Compliance** - Data privacy regulations
- [ ] **Data Encryption** - Encrypt sensitive data at rest
- [ ] **Audit Logging** - Track all admin actions
- [ ] **Terms of Service** - Legal documentation
- [ ] **Privacy Policy** - Data handling transparency
- [ ] **Accessibility** - WCAG 2.1 compliance
- [ ] Status: ~40% complete

---

## 📱 Future Enhancements (2027+)

### Mobile Application
- [ ] React Native mobile app
- [ ] Push notifications
- [ ] Mobile wallet integration
- [ ] QR code scanning
- [ ] Offline mode

### Advanced Features
- [ ] AI Product Recommendations
- [ ] Chatbot Customer Support
- [ ] Virtual Try-On (AR)
- [ ] Subscription Service
- [ ] Marketplace (3rd party sellers)

### Analytics & Business
- [ ] Advanced Reporting
- [ ] Business Intelligence
- [ ] Predictive Analytics
- [ ] Customer Segmentation
- [ ] Marketing Automation

---

## 📝 Summary of Key Changes (December 2025)

**Recent Updates:**
- Default location changed from USA to New Zealand
- Default currency changed from USD to NZD
- New Zealand-specific shipping tiers implemented in planning
- Google Address Autocomplete API integration planned
- Rating system with email-based collection planned
- Admin settings page for system configuration planned
- Error page customization required (403, 404, 500)
- Component refactoring in progress
- Admin dashboard polishing ongoing

**Next Priorities:**
1. Complete component refactoring and separation
2. Implement Gallery, Home, and About Us pages
3. Create custom error pages
4. Integrate Google Address Autocomplete API
5. Implement rating system with admin management
6. Build admin settings interface
7. Develop payment processing

---

**Last Updated:** January 4, 2026  
**Status:** Active Development  
**Note:** Timeline and priorities subject to change based on development progress and user feedback.

---

## 📊 Technical Debt & Maintenance

### Code Quality
- [ ] Unit test coverage (Jest)
- [ ] Integration test suite
- [ ] E2E tests (Cypress)
- [ ] Code documentation

### Performance
- [ ] Image optimization & lazy loading
- [ ] Database query optimization
- [ ] Bundle size reduction
- [ ] Caching strategies

### Security
- [ ] Rate limiting implementation
- [ ] Input sanitization audit
- [ ] CORS security review
- [ ] Dependency vulnerability scan
