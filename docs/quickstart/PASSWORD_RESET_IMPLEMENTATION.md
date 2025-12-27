# Password Reset Feature - Implementation Guide

## Overview

This document describes the complete implementation of the password reset functionality for the Orbis application, following the MVC architecture pattern.

---

## Features Implemented

### Backend Components

1. **Model** - `passwordResetModel.js`
   - Creates and manages password reset tokens
   - Validates tokens (expiration, usage)
   - Cleans up expired tokens

2. **Service** - `passwordResetService.js`
   - `requestPasswordReset()` - Generates secure tokens and initiates reset
   - `resetPassword()` - Validates token and updates password

3. **Controller** - `passwordResetController.js`
   - `forgotPassword` - Handles forgot password requests
   - `resetPasswordHandler` - Processes password reset with token

4. **Routes** - `passwordResetRoutes.js`
   - `POST /api/forgot-password` - Request password reset
   - `POST /api/reset-password` - Complete password reset

5. **Validator** - `passwordResetValidator.js`
   - Validates email format for forgot password
   - Validates token and new password for reset

6. **User Model Extension** - `userModel.js`
   - Added `updatePassword()` method for password updates

### Frontend Components

1. **ForgotPassword.jsx** - Page for requesting password reset
2. **SetNewPassword.jsx** - Page for setting new password with token
3. **LoginModal.jsx** - Updated with "Forgot Password?" link
4. **Auth.module.css** - Added styles for password reset UI

### Database

- **password_resets table**
  - Stores reset tokens with 15-minute expiration
  - Tracks token usage to prevent reuse
  - Auto-deletes expired tokens

---

## API Endpoints

### 1. Request Password Reset

**Endpoint:** `POST /api/forgot-password`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password reset email sent. Please check your inbox.",
  "data": {
    "email": "user@example.com",
    "resetToken": "abc123...",  // Development only
    "resetLink": "http://..."    // Development only
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Email is required"
}
```

### 2. Reset Password

**Endpoint:** `POST /api/reset-password`

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "password": "NewPassword123",
  "confirmPassword": "NewPassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password updated successfully. You can now login with your new password.",
  "data": {
    "userId": "user-uuid"
  }
}
```

**Error Responses:**

- **400 - Invalid/Expired Token:**
```json
{
  "success": false,
  "message": "Reset token is invalid or has expired"
}
```

- **400 - Validation Error:**
```json
{
  "success": false,
  "message": "Passwords do not match",
  "errors": [...]
}
```

---

## Database Setup

### Option 1: Docker Init (Recommended for new deployments)

The migration file `03-create-password-resets-table.sql` will run automatically when the database container starts for the first time.

### Option 2: Manual Migration (For existing databases)

Run the migration script:

```bash
cd backend
node src/db/migrations/create-password-resets-table.js
```

### Table Schema

```sql
CREATE TABLE password_resets (
  reset_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  reset_token VARCHAR(64) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  used_at DATETIME DEFAULT NULL,
  
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  
  INDEX idx_reset_token (reset_token),
  INDEX idx_user_id (user_id),
  INDEX idx_expires_at (expires_at)
);
```

---

## Frontend Routes

### Added Routes in App.jsx

```jsx
<Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password" element={<SetNewPassword />} />
```

### User Flow

1. **Initiate Reset:**
   - User clicks "Forgot Password?" in Login Modal
   - Redirected to `/forgot-password`
   - Enters email address
   - Receives reset link

2. **Reset Password:**
   - User clicks link in email (or uses development link)
   - Redirected to `/reset-password?token=...`
   - Enters and confirms new password
   - Redirected to home page

---

## Security Features

### Token Security
- **Hashed Storage:** Tokens are SHA-256 hashed before storage
- **15-Minute Expiration:** Tokens expire after 15 minutes
- **Single Use:** Tokens are invalidated after successful use
- **Secure Generation:** Uses `crypto.randomBytes()` for token generation

### Password Validation
- Minimum 8 characters
- Must include uppercase letter
- Must include lowercase letter
- Must include number

### Privacy Protection
- Does not reveal if email exists in system (for security)
- Returns success message regardless of email existence

---

## Testing the Feature

### Development Mode

The forgot password endpoint returns the reset token and link directly in the response for testing purposes. **Remove these in production!**

### Test Flow

1. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test forgot password:**
   - Navigate to home page
   - Click Login
   - Click "Forgot Password?"
   - Enter a registered email
   - Copy the reset link from the response

4. **Test password reset:**
   - Paste the reset link in browser
   - Enter new password
   - Confirm password matches
   - Submit and verify redirect

---

## Production Considerations

### Email Integration

Currently, the system logs the reset token to console. For production:

1. **Install nodemailer:**
   ```bash
   npm install nodemailer
   ```

2. **Configure email service in `passwordResetService.js`:**
   ```javascript
   const nodemailer = require('nodemailer');
   
   const transporter = nodemailer.createTransport({
     // Configure your email service
   });
   
   // Send email with reset link
   await transporter.sendMail({
     to: user.user_email,
     subject: 'Reset Your Orbis Password',
     html: `<p>Click here to reset: ${resetLink}</p>`
   });
   ```

3. **Remove development response data:**
   - Remove `resetToken` and `resetLink` from response
   - Only return success message

### Environment Variables

Add to `.env.prod`:
```
FRONTEND_URL=https://your-production-domain.com
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### Security Enhancements

- Implement rate limiting on reset endpoints
- Add CAPTCHA to forgot password form
- Log reset attempts for security monitoring
- Consider 2FA for sensitive accounts

---

## Files Created/Modified

### Backend Files Created
- `src/services/passwordResetService.js`
- `src/controllers/passwordResetController.js`
- `src/routes/passwordResetRoutes.js`
- `src/model/passwordResetModel.js`
- `src/validators/userValidator/passwordResetValidator.js`
- `src/db/migrations/create-password-resets-table.js`
- `docker-init/03-create-password-resets-table.sql`

### Backend Files Modified
- `src/model/userModel.js` - Added `updatePassword()` method
- `src/constants/errorMessages.js` - Added password reset errors
- `src/constants/successMessages.js` - Added password reset success messages
- `src/server.js` - Registered password reset routes

### Frontend Files Created
- `src/pages/common/auth/ForgotPassword.jsx`
- `src/pages/common/auth/SetNewPassword.jsx`

### Frontend Files Modified
- `src/App.jsx` - Added password reset routes
- `src/pages/common/auth/LoginModal.jsx` - Added forgot password link
- `src/pages/common/auth/Auth.module.css` - Added password reset styles

---

## Maintenance

### Cleanup Expired Tokens

Run periodically to clean up expired tokens:

```javascript
// In passwordResetModel.js
passwordResetModel.deleteExpiredTokens((err, result) => {
  console.log(`Cleaned up ${result.affectedRows} expired tokens`);
});
```

Consider setting up a cron job to run this daily.

---

## Troubleshooting

### Token Not Found
- Check token hasn't expired (15-minute limit)
- Verify token wasn't already used
- Ensure database migration ran successfully

### Email Not Sending
- Verify email service configuration
- Check console logs for error messages
- Test with a known working email account

### Database Errors
- Ensure `password_resets` table exists
- Check foreign key constraint on `user_id`
- Verify user exists in `users` table

---

## Support

For questions or issues, refer to:
- [Password Reset Flow Documentation](../docs/flows/password-reset-flow.md)
- [Authentication Flow Documentation](../docs/flows/authentication-flow.md)
- Main project README

---

**Implementation Date:** December 27, 2025  
**Status:** ✅ Complete and Ready for Testing
