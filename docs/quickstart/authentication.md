///////////////////////////////////////////////////////////////////////
// =========== AUTHENTICATION SYSTEM DOCUMENTATION =================== //
///////////////////////////////////////////////////////////////////////

/**
 * DOCUMENT PURPOSE:
 * Complete guide to the authentication system including login, registration,
 * session management, AuthContext, and security features.
 * 
 * FEATURES: Login, Registration, Session Management, AuthContext, Cart Merge, Password Reset
 * LAST UPDATED: December 29, 2025
 * VERSION: 1.0
 */

---

## 📋 Overview

The **Authentication System** manages user identity, session persistence, and access control throughout the Orbis platform. Key features include:

- **User Registration** with email, password, profile details, and avatar upload
- **User Login** with email/password authentication and session management
- **Session Persistence** across page refreshes and browser sessions
- **AuthContext** providing user state to entire application
- **Cart Merge** automatically combining guest and user carts on login
- **Password Reset** for account recovery
- **Role-Based Access Control** for admin features
- **Secure Session Cookies** with httpOnly and secure flags

---

## 🗂️ File Structure

### Frontend

```
frontend/src/pages/common/auth/
├── LoginModal.jsx                  # Login modal component
├── RegisterForm.jsx                # Registration form component
├── Profile.jsx                     # User profile page
├── ForgotPassword.jsx              # Forgot password page
├── SetNewPassword.jsx              # Password reset page
│
├── components/
│   ├── PersonalDetailsDiv.jsx      # First/last name inputs
│   ├── ProfileDiv.jsx              # Nickname/avatar inputs
│   └── FullAddressDiv.jsx          # Address form fields
│
├── constants/
│   └── authConstants.js            # Auth API endpoints, messages
│
├── functions/
│   ├── handleLogin.js              # Login API call handler
│   ├── handleLogout.js             # Logout API call handler
│   ├── handleSubmitLogin.js        # Form submission logic
│   ├── handleSubmitRegistration.js # Registration submission
│   ├── handleAvatarChange.js       # Avatar upload handler
│   ├── handleDeleteAvatar.js       # Avatar deletion handler
│   ├── handleProfileSubmit.js      # Profile update handler
│   ├── capitalizeWords.js          # Text formatting
│   ├── useRedirectAfterRegistration.js  # Post-register redirect
│   └── mergeCart.js                # Guest cart merge on login
│
├── helpers/
│   └── [Various auth helpers]
│
├── validators/
│   ├── loginValidator.js           # Login form validation
│   ├── registrationValidator.js    # Registration validation
│   └── passwordValidator.js        # Password strength check
│
├── context/
│   └── AuthContext.jsx             # Auth context provider
│
└── Auth.module.css
```

### Backend

```
backend/src/
├── controllers/
│   ├── loginController.js          # Login/logout/session endpoints
│   ├── registerController.js       # Registration endpoint
│   └── profileController.js        # Profile CRUD endpoints
│
├── services/
│   ├── loginUserService.js         # Login business logic
│   ├── registerUserService.js      # Registration business logic
│   └── profileService.js           # Profile management logic
│
├── model/
│   ├── userModel.js                # User database operations
│   └── passwordResetModel.js       # Password reset operations
│
├── routes/
│   ├── loginUserRoutes.js          # Login/logout routes
│   ├── registerUserRoutes.js       # Registration routes
│   └── profileRoutes.js            # Profile routes
│
├── middleware/
│   ├── authMiddleware.js           # Auth verification
│   ├── sessionMiddleware.js        # Session setup
│   └── validateSession.js          # Session validation
│
├── validators/
│   ├── loginValidator.js           # Login input validation
│   ├── registrationValidator.js    # Registration validation
│   └── profileValidator.js         # Profile update validation
│
└── helpers/
    ├── createUserAsync.js          # User creation utility
    ├── createUserProfile.js        # Profile creation utility
    └── getUserByEmailAsync.js      # User lookup utility
```

---

## 🔐 Authentication Flow

### User Registration

**Step 1: Access Registration**
- User clicks "Register" link in LoginModal
- Navigates to `/register` page
- RegisterForm displays multi-section form

**Step 2: Fill Registration Form**

**Section 1: Personal Details**
- First Name (required, text)
- Last Name (required, text)

**Section 2: Profile**
- Email (required, unique, valid email format)
- Password (required, min 8 chars, upper/lower/number)
- Confirm Password (required, must match)
- Nickname (optional, text)
- Avatar (optional, image upload)

**Section 3: Address**
- Address Line 1 (required)
- Address Line 2 (optional)
- City (required)
- State/Province (required)
- Zip/Postal Code (required)
- Country (dropdown, default New Zealand)

**Step 3: Submit Registration**

```javascript
// Frontend sends:
POST /api/register
{
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  password: "SecurePass123",
  nickname: "Johnny",
  address: "123 Main St",
  addressLine2: "Apt 4",
  city: "Auckland",
  state: "Auckland",
  zipCode: "1010",
  avatar: File // Optional, multipart
}
```

**Backend Processing:**
1. Validate all required fields
2. Check email is unique
3. Hash password with bcrypt
4. Compress and save avatar (if uploaded)
5. Create user record
6. Create user profile record
7. Create session

**Success Response (201):**
```javascript
{
  message: "User created successfully",
  user: {
    id: "user-uuid",
    email: "john@example.com",
    firstName: "John",
    lastName: "Doe",
    nickname: "Johnny",
    avatar: "http://localhost:4000/uploads/avatars/...",
    role: "user",
    status: "active",
    address: "123 Main St",
    addressLine2: "Apt 4",
    city: "Auckland",
    state: "Auckland",
    zipCode: "1010"
  }
}
```

**Frontend After Success:**
1. Stores user in AuthContext
2. Saves user to localStorage
3. Updates session with user data
4. Shows success message
5. Redirects to home page after 3 seconds

### User Login

**Step 1: Access Login**
- User clicks Profile/Login button in MainNavBar
- LoginModal displays

**Step 2: Enter Credentials**
- Email (required, valid format)
- Password (required, non-empty)

**Step 3: Submit Login**

```javascript
// Frontend sends:
POST /api/login
{
  email: "john@example.com",
  password: "SecurePass123"
}
```

**Backend Processing:**
1. Validate email format
2. Find user by email
3. Compare password hash with bcrypt
4. If match, create session
5. Return user data

**Success Response (200):**
```javascript
{
  message: "Login successful",
  user: {
    id: "user-uuid",
    email: "john@example.com",
    firstName: "John",
    lastName: "Doe",
    nickname: "Johnny",
    avatar: "...",
    role: "user",
    status: "active"
  }
}
```

**Error Response (401):**
```javascript
{
  message: "Invalid email or password"
}
```

**Frontend After Success:**
1. Stores user in AuthContext
2. Saves user to localStorage
3. Merges guest cart (if items exist)
4. Closes LoginModal
5. Updates UI with user info

### Session Persistence

**On App Load:**

1. App mounts, AuthContext initializes
2. Checks localStorage for user data (fallback)
3. Makes request to `/api/session` endpoint
4. If user in session, restores authentication
5. No new login needed
6. User cart available immediately

**Session Duration:**
- Default: 30 days (configurable)
- Extended on each request
- Survives browser close
- Survives page refresh

### User Logout

**Step 1: Click Logout**
- User clicks logout button in profile/menu

**Step 2: Submit Logout**

```javascript
POST /api/logout
```

**Backend Processing:**
1. Destroy session
2. Clear session cookie
3. Return success message

**Frontend After Success:**
1. Clears user from AuthContext
2. Removes user from localStorage
3. Redirects to home page
4. Shows logout message
5. LoginModal available again

### Cart Merge on Login

**When Guest Logs In:**

1. Guest has items in cart (session-based)
2. Login successful
3. `mergeCart()` called automatically
4. Backend operation:
   - Finds guest cart by session_id
   - Finds user's cart by user_id
   - Merges items (no duplicates)
   - Updates user_id on guest cart items
   - Clears session_id
5. Frontend updates:
   - Refreshes cart badge
   - Emits "cartUpdated" event
   - Cart page reloads if open
   - Updates cart totals

---

## 🎨 Components

### LoginModal Component

**Location:** `frontend/src/pages/common/auth/LoginModal.jsx`

**Props:**
```typescript
{
  onClose: () => void;  // Close modal callback
}
```

**Features:**
- Email input field
- Password input field
- Login button
- "Forgot Password?" link
- "Register here" link
- Error message display
- Form validation
- Loading state on button
- Close button (×)

**Usage:**
```jsx
// Usually displayed via MainNavBar state
const [showLoginModal, setShowLoginModal] = useState(false);

{showLoginModal && (
  <LoginModal onClose={() => setShowLoginModal(false)} />
)}
```

### RegisterForm Component

**Location:** `frontend/src/pages/common/auth/RegisterForm.jsx`
**Route:** `/register`

**Features:**
- Multi-section form
- Personal details section (name)
- Profile section (email, password, avatar)
- Address section (full address)
- Avatar preview
- Delete avatar button
- Submit button
- Error/success messages
- Form validation
- Loading state during submission
- Auto-redirect after success

**Sections:**
1. **PersonalDetailsDiv** - First and last name
2. **ProfileDiv** - Email, password, nickname, avatar
3. **FullAddressDiv** - Complete address fields

### Profile Component

**Location:** `frontend/src/pages/common/auth/Profile.jsx`
**Route:** `/profile`

**Features:**
- View user information
- Edit user details
- Avatar display and upload
- Delete avatar
- Change password
- View saved addresses
- Add new address
- Set default address
- Delete address
- Account settings

**Only accessible by authenticated users**

---

## 🔌 API Endpoints

### POST /api/register

**Purpose:** Create new user account

**Authentication:** Not required

**Request Body (multipart/form-data):**
```javascript
{
  firstName: "John",              // Required
  lastName: "Doe",                // Required
  email: "john@example.com",      // Required, unique
  password: "SecurePass123",      // Required, 8+ chars
  nickname: "Johnny",             // Optional
  address: "123 Main St",         // Required
  addressLine2: "Apt 4",          // Optional
  city: "Auckland",               // Required
  state: "Auckland",              // Required
  zipCode: "1010",                // Required
  avatar: File                    // Optional, image file
}
```

**Validation:**
- All required fields present
- Email is unique
- Email is valid format
- Password is min 8 chars
- Password contains upper, lower, number
- Address fields are valid

**Success Response (201):**
```javascript
{
  message: "User created successfully",
  user: { /* user data */ }
}
```

**Error Response (400):**
```javascript
{
  message: "Email already in use"
}
```

---

### POST /api/login

**Purpose:** Authenticate user and create session

**Authentication:** Not required

**Request Body:**
```javascript
{
  email: "john@example.com",      // Required
  password: "SecurePass123"       // Required
}
```

**Validation:**
- Email and password required
- Email format is valid

**Success Response (200):**
```javascript
{
  message: "Login successful",
  user: { /* user data */ }
}
```

**Error Response (401):**
```javascript
{
  message: "Invalid email or password"
}
```

**Session Cookie:**
- Name: `connect.sid` (default)
- httpOnly: true (secure, not accessible via JS)
- Secure: true (HTTPS only in production)
- SameSite: Lax (CSRF protection)

---

### POST /api/logout

**Purpose:** Destroy user session

**Authentication:** Required

**Request Body:** Empty

**Success Response (200):**
```javascript
{
  message: "Logged out successfully"
}
```

---

### GET /api/session

**Purpose:** Check if user is logged in and get user data

**Authentication:** Not required (but checks session)

**Request Body:** Empty

**Success Response (200):**
```javascript
// If logged in:
{
  user: { /* user data */ }
}

// If not logged in:
{
  user: null
}
```

**Uses:**
- On app startup to restore session
- Periodically to refresh user data
- After login/register to confirm

---

### GET /api/profile/:userId

**Purpose:** Get user profile details

**Authentication:** Required

**Success Response (200):**
```javascript
{
  success: true,
  data: {
    id: "user-uuid",
    email: "john@example.com",
    firstName: "John",
    lastName: "Doe",
    nickname: "Johnny",
    avatar: "url",
    role: "user",
    status: "active",
    phone: "021234567",
    address: "123 Main St",
    addressLine2: "Apt 4",
    city: "Auckland",
    state: "Auckland",
    zipCode: "1010",
    country: "New Zealand",
    createdAt: "2025-01-15T..."
  }
}
```

---

### PATCH /api/profile/:userId

**Purpose:** Update user profile

**Authentication:** Required

**Request Body:**
```javascript
{
  firstName: "John",              // Optional
  lastName: "Doe",                // Optional
  nickname: "Johnny",             // Optional
  phone: "021234567",             // Optional
  address: "123 Main St",         // Optional
  addressLine2: "Apt 4",          // Optional
  city: "Auckland",               // Optional
  state: "Auckland",              // Optional
  zipCode: "1010"                 // Optional
}
```

**Success Response (200):**
```javascript
{
  success: true,
  message: "Profile updated successfully",
  data: { /* updated user */ }
}
```

---

### POST /api/avatar/upload

**Purpose:** Upload user avatar

**Authentication:** Required

**Request Body (multipart/form-data):**
```javascript
{
  avatar: File  // Image file (jpg, png)
}
```

**Processing:**
1. Validate image file type
2. Validate file size (< 5MB)
3. Compress image
4. Save to uploads directory
5. Update user avatar URL

**Success Response (200):**
```javascript
{
  success: true,
  message: "Avatar uploaded successfully",
  data: {
    avatarUrl: "http://localhost:4000/uploads/avatars/..."
  }
}
```

---

### DELETE /api/avatar

**Purpose:** Delete user avatar

**Authentication:** Required

**Request Body:** Empty

**Success Response (200):**
```javascript
{
  success: true,
  message: "Avatar deleted successfully",
  data: { avatarUrl: null }
}
```

---

## 💾 Database Schema

### Users Table

```sql
CREATE TABLE users (
  user_id VARCHAR(36) PRIMARY KEY,
  user_email VARCHAR(255) UNIQUE NOT NULL,
  user_password VARCHAR(255) NOT NULL,
  user_first_name VARCHAR(100),
  user_last_name VARCHAR(100),
  user_phone VARCHAR(20),
  user_avatar VARCHAR(255),
  user_role ENUM('user', 'admin') DEFAULT 'user',
  user_status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  KEY idx_email (user_email),
  KEY idx_role (user_role),
  KEY idx_status (user_status)
);
```

### User Profiles Table

```sql
CREATE TABLE user_profiles (
  profile_id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL UNIQUE,
  user_nickname VARCHAR(100),
  user_address VARCHAR(255),
  user_address_line2 VARCHAR(255),
  user_city VARCHAR(100),
  user_state VARCHAR(100),
  user_zip_code VARCHAR(20),
  user_country VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  KEY idx_user_id (user_id)
);
```

### Sessions Table

```sql
-- Created automatically by express-session
-- Stores session data
CREATE TABLE sessions (
  sid VARCHAR(255) PRIMARY KEY,
  sess JSON NOT NULL,
  expire DATETIME NOT NULL,
  
  KEY idx_expire (expire)
);
```

---

## 🔐 Security Features

### Password Security

**Password Requirements:**
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- Special characters optional

**Password Hashing:**
- Algorithm: bcrypt
- Salt rounds: 10
- One-way hashing (not reversible)
- Safe comparison prevents timing attacks

**Password Storage:**
- Only hashed password stored
- Plain password never logged
- Frontend validation before submission
- Backend validation on all password changes

### Session Security

**Session Cookie:**
- **httpOnly:** true - Not accessible via JavaScript (prevents XSS)
- **Secure:** true - Only sent over HTTPS (in production)
- **SameSite:** Lax - Prevents CSRF attacks
- **Max-Age:** 30 days (configurable)

**Session Storage:**
- Stored in database (not in-memory)
- Survives server restart
- Can be invalidated anytime
- Destroyed on logout

**Session Validation:**
- Every request validates session
- Checks session expiration
- Verifies user hasn't been deleted
- Updates session expiration on use

### CSRF Protection

**Express Session:**
- Uses SameSite cookie attribute
- Prevents cross-site requests

**CORS Configuration:**
- Frontend and backend on different origins
- Explicit CORS headers
- withCredentials required for requests

### Password Reset Security

**Token Security:**
- 15-minute expiration
- One-time use (can't reuse)
- Hashed in database
- Not shown in logs

---

## 🔗 AuthContext

### Location
`frontend/src/pages/common/context/AuthContext.jsx`

### Context Values

```javascript
{
  user: User | null,              // Current user data
  loading: boolean,               // Initial load status
  login: (email, password) => Promise<User>,
  logout: () => Promise<void>,
  setUser: (user: User | null) => void
}
```

### Usage

**Access Current User:**
```jsx
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

function MyComponent() {
  const { user } = useContext(AuthContext);
  
  if (!user) return <p>Please login</p>;
  return <p>Welcome {user.firstName}!</p>;
}
```

**Perform Login:**
```jsx
const { login } = useContext(AuthContext);

const handleLogin = async () => {
  try {
    const user = await login(email, password);
    // Success - redirected
  } catch (error) {
    // Handle error
  }
};
```

**Perform Logout:**
```jsx
const { logout } = useContext(AuthContext);

const handleLogout = async () => {
  await logout();
  // Session destroyed, redirected
};
```

### Session Restore

On app load, AuthContext automatically:
1. Checks localStorage for user data (fallback)
2. Calls GET `/api/session` endpoint
3. If user in session, restores authentication
4. Sets loading to false
5. No login needed if session still valid

---

## 📱 User Experience Features

### Loading States
- Full-page loader during session restore
- Button loading spinner during auth
- Form validation during input

### Error Handling
- Clear error messages for validation failures
- User-friendly error display
- Retry capability
- Network error handling

### Success Feedback
- Success message after registration
- Auto-redirect to home
- Profile updated confirmation
- Logout success message

### Protected Routes
- Non-authenticated users can't access profile
- Admin routes check role
- Automatic redirect to login if needed
- Back button after login goes to original page

---

## 🧪 Testing Checklist

### Registration
- [ ] Access registration page
- [ ] Fill all required fields
- [ ] Submit registration
- [ ] User created successfully
- [ ] Session created
- [ ] Redirected to home
- [ ] User appears in profile
- [ ] Avatar uploaded if provided
- [ ] Duplicate email shows error
- [ ] Password validation enforced
- [ ] Password confirmation validated

### Login
- [ ] Access login modal
- [ ] Enter valid credentials
- [ ] Login successful
- [ ] Session created
- [ ] Modal closes
- [ ] User info displays in navbar
- [ ] Invalid email shows error
- [ ] Invalid password shows error
- [ ] Email/password required

### Session Persistence
- [ ] Page refresh maintains login
- [ ] Browser close and reopen works
- [ ] Tab switching maintains session
- [ ] Session survives 24 hours
- [ ] Cart persists across sessions
- [ ] User data accessible after refresh

### Logout
- [ ] Click logout button
- [ ] Session destroyed
- [ ] Redirected to home
- [ ] Login modal appears
- [ ] User data cleared from navbar
- [ ] Profile page redirects to login

### Cart Merge
- [ ] Add items as guest
- [ ] Login to account
- [ ] Guest items appear in user cart
- [ ] No duplicate items
- [ ] Cart badge updates
- [ ] Cart totals recalculated

### Profile Management
- [ ] View profile page
- [ ] Update user details
- [ ] Upload new avatar
- [ ] Delete avatar
- [ ] Change password
- [ ] Update address

---

## 🔗 Related Documentation

- **[Password Reset](./password-reset.md)** - Account recovery system
- **[Authentication Flow](../flows/authentication-flow.md)** - Complete auth flow
- **[Profile Management](../flows/profile-management-flow.md)** - User profile system
- **[Shop & Cart Flow](../flows/shop-cart-flow.md)** - Cart merge on login
- **[Sitemap](../sitemap.md)** - Documentation index

---

**Document Version:** 1.0  
**Last Updated:** December 29, 2025  
**Status:** ✅ Fully Implemented
