# Future Enhancements & In-Progress Development

This document outlines planned features, in-progress work, and improvements for the Orbis project based on current development status as of December 29, 2025.

---

## 🔄 In Progress - Current Development Phase (December 2025)

### Component Refactoring & Architecture
- [ ] **Auth Component Refactoring** - Separate buttons, helpers, and logic functions
- [ ] **Component Separation** - Extract reusable buttons, form inputs, and helper components
- [ ] **Code Organization** - Separate business logic from UI components
- [ ] **Helper Functions** - Create utility functions for common operations
- [ ] Status: ~40% complete

### Page Development & UI Completion
- [ ] **Gallery Page** - Currently blank, needs implementation
  - [ ] Gallery grid layout with product images
  - [ ] Image carousel with fullscreen view
  - [ ] Expandable product details
  - [ ] Historical information display
  - [ ] Interactive map integration (Google Maps API)
  - [ ] Location markers and info popups
- [ ] **Home Page** - Currently blank, needs enhancement
  - [ ] Hero section with featured products
  - [ ] Featured products carousel
  - [ ] Company highlights
  - [ ] Newsletter signup
  - [ ] Call-to-action sections
- [ ] **About Us Page** - Currently blank, needs implementation
  - [ ] Company mission and values
  - [ ] Team member profiles
  - [ ] Company history and achievements
  - [ ] Contact information
  - [ ] Google Maps location embed
  - [ ] Social media links
- [ ] Status: ~20% complete

### Admin Dashboard Polishing
- [ ] **Code Refactoring** - Clean up admin component code
- [ ] **Testing** - Comprehensive admin feature testing
- [ ] **UI Polish** - Improve admin dashboard design and usability
- [ ] Status: ~60% complete

### Error Pages (Required)
- [ ] **403 Forbidden Page** - Custom design and routing
- [ ] **404 Not Found Page** - Custom design and routing
- [ ] **500 Server Error Page** - Custom design and routing
- [ ] Status: Not started

### Regional & Localization Updates (Required)
- [ ] **Change Default Nationality** - USA → New Zealand ✅ (to be implemented in user_profiles)
- [ ] **Change Default Currency** - USD → NZD ✅ (to be implemented in products and orders)
- [ ] **Update Price Display** - Show prices in NZD across app
- [ ] **Update Address Fields** - Optimize for New Zealand addresses
- [ ] Status: Not started

---

## 📦 Phase 1 - Payment & Shipping (Q1 2026)

### Payment Processing
- [ ] **Payment Gateway Integration** - Stripe or similar payment processor
- [ ] **Payment Processing Pages** - Secure payment form and confirmation
- [ ] **Order Simulation Logic** - Simulate payment and order processing
- [ ] **Order Confirmation** - Email with order details
- [ ] **Invoice Generation** - PDF invoice creation and download
- [ ] Status: Not started

### Shipping & Freight System
- [ ] **Freight Pricing Tiers** - Location-based shipping costs:
  - [ ] Local (Tauranga, New Zealand) - Standard rate
  - [ ] National (New Zealand North Island) - Regional rate
  - [ ] National (New Zealand South Island) - Regional rate
  - [ ] International (North America) - International rate
  - [ ] International (Europe) - International rate
  - [ ] International (Asia & Oceania) - International rate
  - [ ] International (South & Central America) - International rate
  - [ ] International (Africa) - International rate
- [ ] **Automatic Tier Selection** - Based on user address
- [ ] **Shipping Calculator** - Real-time shipping cost calculation
- [ ] **Carrier Integration** - Optional carrier APIs (DHL, FedEx, etc.)
- [ ] Status: Not started

### Google Address Autocomplete API
- [ ] **Address API Integration** - Implement Google Address Autocomplete
- [ ] **Address Validation** - Validate addresses against API
- [ ] **Auto-fill Functionality** - Auto-populate address fields
- [ ] **Regional Detection** - Automatically detect shipping tier
- [ ] **Multi-address Support** - Allow multiple saved addresses
- [ ] Status: Not started

### Shopping Flow Automation
- [ ] **Order Status Workflow** - Pending → Processing → Shipped → Delivered
- [ ] **Automated Status Updates** - Update based on shipping events
- [ ] **Delivery Tracking** - Provide tracking links to customers
- [ ] **Automated Notifications** - Email/SMS at each stage
- [ ] Status: Not started

---

## 📊 Phase 2 - Rating & Review System (Q1 2026)

### Product Rating System
- [ ] **Rating Database Schema** - New tables for ratings and comments
- [ ] **Email Link Generation** - Send rating link after delivery
- [ ] **One Rating Per User Per Product** - Enforce constraint
- [ ] **Rating Collection Page** - User-friendly rating interface
- [ ] **Star Rating Input** - 1-5 star selection
- [ ] **Comment/Review Input** - Text area for written feedback
- [ ] **Edit Rating** - Allow users to edit rating and comment
- [ ] **View Edit History** - Show when edits were made
- [ ] Status: Not started

### Admin Rating Management
- [ ] **Admin Rating Dashboard** - Dedicated page for viewing all ratings
- [ ] **Rating Filter** - Filter by product, rating score, user
- [ ] **Moderation Tools** - Edit, delete, or hide ratings
- [ ] **Rating Statistics** - Stats card showing rating metrics
- [ ] **Product Rating Display** - Show ratings on product pages
- [ ] **Admin Shortcut** - Quick access from admin dashboard
- [ ] **Manage Individual Ratings** - Full CRUD operations on ratings
- [ ] Status: Not started

---

## ⚙️ Phase 3 - Admin Settings (Q2 2026)

### Freight Price Management
- [ ] **Shipping Tier Configuration** - Admin interface to set rates
- [ ] **Edit Shipping Costs** - Update prices per tier
- [ ] **Tax Configuration** - Optional tax settings by region
- [ ] **Currency Management** - Set display currency globally
- [ ] Status: Not started

### Application Settings
- [ ] **Maintenance Mode (Full)** - Disable entire application
- [ ] **Maintenance Mode (Shop)** - Disable only shop features
- [ ] **User Registration Toggle** - Enable/disable new registrations
- [ ] **System Notifications** - Global announcements/alerts
- [ ] **Email Configuration** - SMTP settings for notifications
- [ ] **Theme Customization** - Brand color settings (gold/black)
- [ ] **Analytics Configuration** - Third-party analytics tracking
- [ ] Status: Not started

---

## 💳 Phase 4 - Enhanced E-Commerce (Q2 2026)

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

**Last Updated:** December 29, 2025  
**Status:** Active Development  
**Note:** Timeline and priorities subject to change based on development progress and user feedback.
