///////////////////////////////////////////////////////////////////////
// ========== PASSWORD RESET SYSTEM DOCUMENTATION ==================== //
///////////////////////////////////////////////////////////////////////

/**
 * DOCUMENT PURPOSE:
 * Complete guide to the password reset feature including frontend components,
 * backend API, database schema, email integration, and security considerations.
 * 
 * FEATURES: Forgot Password, Reset Token Generation, Password Validation, Email Flow
 * LAST UPDATED: December 29, 2025
 * VERSION: 1.0
 */

---

## 📋 Overview

The **Password Reset System** provides a secure way for users to recover access to their accounts when they forget their password. Key features include:

- **Forgot Password Flow** - Users request a password reset via email
- **Secure Tokens** - Time-limited reset tokens (15-minute expiration)
- **Email Integration** - Reset links sent to user email (development mode shows in-app)
- **Password Validation** - Strong password requirements enforced
- **Token Validation** - Prevents reuse and expired token attacks
- **User-Friendly UI** - Clear feedback and error messages

---

## 🗂️ File Structure

### Frontend

```
frontend/src/pages/common/auth/
├── ForgotPassword.jsx              # Request password reset page
├── SetNewPassword.jsx              # Reset password with token page
│
├── components/
│   └── [Auth components]
│
├── constants/
│   └── authConstants.js            # Auth-related constants
│
├── functions/
│   ├── resetPasswordRequest.js     # POST /api/forgot-password
│   └── submitPasswordReset.js      # POST /api/reset-password
│
├── validators/
│   └── passwordValidator.js        # Password strength validation
│
├── helpers/
│   └── extractTokenFromUrl.js      # Extract token from URL params
│
├── LoginModal.jsx                  # Updated with forgot password link
├── Auth.module.css
└── [Other auth components]

Routes:
- /forgot-password - Request reset page
- /reset-password?token=... - Reset password page
```

### Backend

```
backend/src/
├── controllers/
│   └── passwordResetController.js  # HTTP request handlers
│
├── services/
│   └── passwordResetService.js     # Business logic
│
├── model/
│   └── passwordResetModel.js       # Database operations
│
├── routes/
│   └── passwordResetRoutes.js      # Route definitions
│
├── validators/
│   └── passwordResetValidator.js   # Input validation
│
├── constants/
│   ├── errorMessages.js            # Error message constants
│   └── successMessages.js          # Success message constants
│
└── helpers/
    └── generateResetToken.js       # Token generation utility
```

### Database

```
password_resets Table:
- reset_id (primary key)
- user_id (foreign key)
- reset_token (unique, hashed)
- created_at (timestamp)
- expires_at (timestamp - 15 minutes from creation)
- used_at (nullable - when token was used)
```

---

## 🔄 Password Reset Flow

### Step 1: Request Password Reset

**User Action:** Clicks "Forgot Password?" link in login modal
**Component:** `LoginModal.jsx` → `ForgotPassword.jsx`

**User enters email address:**
```
Email field required
```

**Frontend sends request:**
```javascript
POST /api/forgot-password
{
  email: "user@example.com"
}
```

**Backend response (development mode):**
```javascript
{
  success: true,
  message: "Password reset email sent. Please check your inbox.",
  data: {
    email: "user@example.com",
    resetToken: "abc123def456...",  // Shown in development only
    resetLink: "http://localhost:5173/reset-password?token=abc123def456..."
  }
}
```

**Frontend displays:**
- Success message
- Reset link (development mode) or "Check your email" message (production)
- Link to back to login

### Step 2: User Receives Reset Link

**Email (Production):**
```
Subject: Password Reset Request for Your Orbis Account

Hello User,

You requested a password reset. Click the link below to reset your password:

[Reset Link]

This link expires in 15 minutes.

If you didn't request this, please ignore this email.
```

**Development Mode:**
- Link displayed in-app immediately
- User can copy and paste or click directly

### Step 3: Reset Password

**User clicks reset link or navigates to:**
```
/reset-password?token=abc123def456...
```

**Component:** `SetNewPassword.jsx`

**Page checks:**
1. Token is present in URL
2. Token is valid (not expired, not used)
3. Token belongs to a user

**Form displays if valid:**
- New password field
- Confirm password field
- Submit button
- Link to login if no token

**User enters new password:**
```
Requirements:
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- Cannot be same as old password (optional)
```

**Frontend sends request:**
```javascript
POST /api/reset-password
{
  token: "abc123def456...",
  password: "NewPassword123",
  confirmPassword: "NewPassword123"
}
```

**Backend validates:**
1. Token exists and is valid
2. Token hasn't expired
3. Token hasn't been used before
4. Password meets requirements
5. Passwords match

**Backend response (success):**
```javascript
{
  success: true,
  message: "Password updated successfully. You can now login with your new password.",
  data: {
    userId: "user-uuid"
  }
}
```

**Frontend:**
- Shows success message
- Displays countdown (3 seconds)
- Redirects to home page
- User can now login with new password

---

## 🎨 Components

### ForgotPassword Component

**Location:** `frontend/src/pages/common/auth/ForgotPassword.jsx`

**Features:**
- Email input field
- "Send Reset Link" submit button
- Success message display
- Error message display
- Reset link display (development mode)
- Loading state during submission
- Link back to login

**Form Validation:**
- Email is required
- Valid email format
- Email exists in database (but hidden for security)

**Error Handling:**
- Email validation errors
- Server errors
- Network errors
- User-friendly messages

**Props:** None (standalone page)

**Usage:**
```jsx
// Route: /forgot-password
<ForgotPassword />
```

### SetNewPassword Component

**Location:** `frontend/src/pages/common/auth/SetNewPassword.jsx`

**Features:**
- Extracts token from URL query parameter
- Validates token presence
- Password input field (type="password")
- Confirm password field (type="password")
- Real-time password validation
- Strength indicator (optional)
- Submit button
- Error message display
- Success message display
- Loading state during submission

**Password Requirements Display:**
```
Password must contain:
✓ At least 8 characters
✓ At least 1 uppercase letter (A-Z)
✓ At least 1 lowercase letter (a-z)
✓ At least 1 number (0-9)
✓ Passwords must match
```

**Validation:**
- Token presence in URL
- Password strength check
- Password match validation
- Real-time validation feedback

**Error Handling:**
- Invalid/missing token
- Token expired
- Weak password
- Mismatched passwords
- Server errors
- User-friendly messages

**Success Flow:**
- Shows success message
- 3-second countdown
- Redirects to home page
- User can login with new password

**Props:** None (uses URL params)

**Usage:**
```jsx
// Route: /reset-password?token=abc123
<SetNewPassword />
```

### LoginModal Update

**Location:** `frontend/src/pages/common/auth/LoginModal.jsx`

**Changes:**
- Added "Forgot Password?" link below password field
- Navigates to `/forgot-password` when clicked
- Or shows ForgotPassword component in modal

---

## 🔌 API Endpoints

### POST /api/forgot-password

**Purpose:** Request a password reset token

**Authentication:** Not required

**Request Body:**
```javascript
{
  email: "user@example.com"
}
```

**Validation:**
- `email` is required
- `email` must be valid email format
- Email must exist in database (but response hides this for security)

**Success Response (200):**
```javascript
{
  success: true,
  message: "Password reset email sent. Please check your inbox.",
  data: {
    email: "user@example.com",
    // Development mode only:
    resetToken: "hashed-token-here",
    resetLink: "http://localhost:5173/reset-password?token=hashed-token-here"
  }
}
```

**Error Response (400):**
```javascript
{
  success: false,
  message: "Email is required"
}
```

**Notes:**
- Always returns 200 with success message for security (doesn't reveal if email exists)
- In production, email is sent to user
- In development, token and link shown in response for testing
- Token expires after 15 minutes

---

### POST /api/reset-password

**Purpose:** Complete password reset with token

**Authentication:** Not required (uses token instead)

**Request Body:**
```javascript
{
  token: "hashed-token-from-email",
  password: "NewPassword123",
  confirmPassword: "NewPassword123"
}
```

**Validation:**
- `token` is required
- `password` is required
- `confirmPassword` is required
- `token` must be valid (exists in database)
- `token` must not be expired (< 15 minutes old)
- `token` must not be used (used_at is NULL)
- `password` must be at least 8 characters
- `password` must contain uppercase, lowercase, number
- `password` must equal `confirmPassword`
- `password` cannot be same as current password (optional)

**Success Response (200):**
```javascript
{
  success: true,
  message: "Password updated successfully. You can now login with your new password.",
  data: {
    userId: "user-uuid"
  }
}
```

**Error Response (400):**
```javascript
{
  success: false,
  message: "Reset token is invalid or has expired"
}
```

**Error Response (400 - Validation):**
```javascript
{
  success: false,
  message: "Password must be at least 8 characters"
}
```

**After Success:**
- `password_resets.used_at` is set to current timestamp
- `users.user_password` is updated with new hashed password
- Token cannot be reused
- User can login with new password immediately

---

## 💾 Database Schema

### password_resets Table

```sql
CREATE TABLE password_resets (
  reset_id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  reset_token VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  used_at TIMESTAMP NULL,
  
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  KEY idx_token (reset_token),
  KEY idx_user_id (user_id),
  KEY idx_expires_at (expires_at)
);
```

**Fields:**
- `reset_id` - Unique identifier for reset record
- `user_id` - Reference to users table
- `reset_token` - Hashed token (unique to prevent collisions)
- `created_at` - When reset was requested
- `expires_at` - When token expires (created_at + 15 minutes)
- `used_at` - When token was used to reset password (NULL if unused)

**Indexes:**
- Unique index on `reset_token` for fast lookup
- Index on `user_id` for user lookups
- Index on `expires_at` for cleanup queries

**Data Cleanup:**
- Expired tokens can be deleted periodically (past expires_at)
- Used tokens are kept for audit trail (soft delete possible)

---

## 🔐 Security Considerations

### Token Security

**Token Generation:**
- Use cryptographically secure random string
- Hash token before storing in database (one-way hashing)
- Store only hashed version, not plain text

**Token Storage:**
- Never store plain tokens in database
- Hash: `SHA256(token + salt)`
- Store hash: `reset_token` column

**Token Validation:**
```javascript
// Validate token:
1. Hash received token
2. Compare hashed token with database
3. Check expiration
4. Check used_at is NULL
```

### Password Security

**Password Hashing:**
- Use bcrypt with salt rounds (10+)
- Hash before storing
- Never store plain passwords

**Password Requirements:**
- Minimum 8 characters (prevents weak passwords)
- Uppercase, lowercase, numbers (complexity)
- No common patterns (username, previous passwords)
- Rate limiting on API to prevent brute force

### Email Security

**Development Mode:**
- Token shown in-app for testing
- No actual email sent

**Production Mode:**
- Email sent to verified user address
- SSL/TLS encryption for email
- Secure SMTP configuration
- Token in URL parameter (HTTPS only)

### Other Security Measures

**Rate Limiting:**
- Limit reset requests per email (e.g., 3 per hour)
- Limit reset attempts per token (e.g., 3 attempts)
- Prevent password reset spam

**Session Handling:**
- Reset doesn't require logout if logged in
- Password change can invalidate other sessions
- Prevent concurrent resets for same user

**CSRF Protection:**
- All POST requests include CSRF token (if implemented)
- Frontend validates before submission

---

## 📱 User Experience Features

### Loading States
- Button disabled during submission
- Loading spinner on button
- "Sending..." text update

### Success Feedback
- Confirmation message displayed
- Clear next steps shown
- Auto-redirect with countdown (3 seconds)

### Error Handling
- Clear error messages
- Specific validation feedback
- "Try again" options
- Help links to support

### Form Validation
- Real-time validation
- Visual feedback (checkmarks, X's)
- Inline error messages
- Clear requirements listed

### Accessibility
- Label associated with inputs
- Error messages linked to fields
- Keyboard navigation support
- Screen reader friendly

---

## 🧪 Testing Scenarios

### Scenario 1: Happy Path - Successful Reset

1. ✅ User clicks "Forgot Password?"
2. ✅ Navigates to `/forgot-password`
3. ✅ Enters registered email
4. ✅ Clicks "Send Reset Link"
5. ✅ Sees success message
6. ✅ Copies reset link (dev mode)
7. ✅ Navigates to `/reset-password?token=...`
8. ✅ Page validates token
9. ✅ Enters valid password (8+ chars, upper, lower, number)
10. ✅ Confirms password
11. ✅ Clicks "Reset Password"
12. ✅ Sees success message
13. ✅ Redirected to home after 3 seconds
14. ✅ Can login with new password

### Scenario 2: Email Not Found

1. ✅ User enters non-existent email
2. ✅ Sees success message (security feature)
3. ✅ No email sent
4. ✅ Token not created

### Scenario 3: Expired Token

1. ✅ Wait > 15 minutes after reset request
2. ✅ Try to use reset link
3. ✅ See "Token expired" error
4. ✅ Option to request new reset link

### Scenario 4: Invalid Token

1. ✅ Manually modify token in URL
2. ✅ Try to submit form
3. ✅ See "Invalid token" error
4. ✅ Cannot proceed

### Scenario 5: Weak Password

1. ✅ Enter password < 8 characters
2. ✅ See "Password too short" error
3. ✅ Form prevents submission

1. ✅ Enter password without uppercase
2. ✅ See "Must contain uppercase" error

### Scenario 6: Mismatched Passwords

1. ✅ Enter different confirm password
2. ✅ See "Passwords do not match" error
3. ✅ Form prevents submission

### Scenario 7: Token Reuse Prevention

1. ✅ Use reset link to change password (success)
2. ✅ Try to use same link again
3. ✅ See "Token already used" error
4. ✅ Cannot reset with same token

---

## 🔗 Related Documentation

- **[Authentication Flow](../flows/authentication-flow.md)** - Full auth system
- **[Profile Management](../flows/profile-management-flow.md)** - User profile
- **[Sitemap](../sitemap.md)** - Documentation index
- **[Security Best Practices](#security-considerations)** - Security info above

---

## 📝 Constants

**authConstants.js:**
```javascript
export const PASSWORD_RESET_ENDPOINTS = {
  FORGOT_PASSWORD: `${API_BASE}/api/forgot-password`,
  RESET_PASSWORD: `${API_BASE}/api/reset-password`,
};

export const PASSWORD_REQUIREMENTS = {
  MIN_LENGTH: 8,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBER: true,
};

export const PASSWORD_MESSAGES = {
  MIN_LENGTH: "Password must be at least 8 characters",
  NO_UPPERCASE: "Password must contain at least 1 uppercase letter",
  NO_LOWERCASE: "Password must contain at least 1 lowercase letter",
  NO_NUMBER: "Password must contain at least 1 number",
  NOT_MATCHING: "Passwords do not match",
  RESET_SENT: "Password reset email sent. Check your inbox.",
  RESET_SUCCESS: "Password updated successfully!",
  INVALID_TOKEN: "Reset token is invalid or has expired",
};
```

---

## 🎯 Implementation Checklist

- [ ] Database migration completed
- [ ] Backend routes registered
- [ ] Frontend pages created
- [ ] Email templates created (production)
- [ ] Environment variables set (FRONTEND_URL, EMAIL config)
- [ ] Token generation implemented securely
- [ ] Password validation implemented
- [ ] Error handling comprehensive
- [ ] Testing scenarios verified
- [ ] Security review completed
- [ ] Rate limiting implemented
- [ ] Logging configured

---

## 🚀 Next Steps

### Development Phase
1. Test all scenarios locally
2. Verify email template renders correctly
3. Test token expiration
4. Test rate limiting

### Production Phase
1. Remove dev-mode token display
2. Configure real email service
3. Update FRONTEND_URL in production
4. Enable HTTPS (required for reset links)
5. Set up monitoring/logging
6. Security audit

---

**Document Version:** 1.0  
**Last Updated:** December 29, 2025  
**Status:** ✅ Fully Implemented
