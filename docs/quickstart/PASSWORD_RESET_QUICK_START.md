# Password Reset Feature - Quick Start Guide

## 🚀 Quick Setup

### 1. Run Database Migration

If your database is already running, execute the migration:

```bash
cd backend
node src/db/migrations/create-password-resets-table.js
```

Or restart your Docker containers to apply the migration automatically.

### 2. Verify Environment Variables

Ensure your `.env.dev` has:
```env
FRONTEND_URL=http://localhost:5173
```

### 3. Start the Application

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

---

## 🧪 Testing the Feature

### Test Scenario 1: Forgot Password

1. Navigate to `http://localhost:5173`
2. Click the **Profile/Login** button
3. In the login modal, click **"Forgot Password?"**
4. Enter a registered email address
5. Click **"Send Reset Link"**
6. **Development Mode:** Copy the reset link shown in the success message

### Test Scenario 2: Reset Password

1. Paste the reset link in your browser (or click it)
2. You'll be redirected to `/reset-password?token=...`
3. Enter a new password (must meet requirements)
4. Confirm the password
5. Click **"Reset Password"**
6. You'll be redirected to home after 3 seconds
7. Try logging in with your new password

### Test Scenario 3: Expired Token

1. Wait 16 minutes after requesting a reset
2. Try to use the reset link
3. Should see "Reset token is invalid or has expired"
4. Click "Request a new reset link"

### Test Scenario 4: Invalid Token

1. Manually edit the token in the URL
2. Try to submit the form
3. Should see error message about invalid token

---

## 📋 API Testing with Postman/cURL

### Request Password Reset

```bash
curl -X POST http://localhost:4000/api/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Password reset email sent. Please check your inbox.",
  "data": {
    "email": "test@example.com",
    "resetToken": "abc123...",
    "resetLink": "http://localhost:5173/reset-password?token=abc123..."
  }
}
```

### Reset Password

```bash
curl -X POST http://localhost:4000/api/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token":"your-reset-token-here",
    "password":"NewPassword123",
    "confirmPassword":"NewPassword123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Password updated successfully. You can now login with your new password.",
  "data": {
    "userId": "user-uuid"
  }
}
```

---

## ✅ Verification Checklist

- [ ] Database migration completed successfully
- [ ] Backend server running without errors
- [ ] Frontend application accessible
- [ ] Can access forgot password page
- [ ] Can request password reset
- [ ] Reset link is generated and displayed
- [ ] Can access reset password page with token
- [ ] Can set new password
- [ ] Can login with new password
- [ ] Expired tokens are rejected
- [ ] Invalid tokens are rejected
- [ ] Password validation works correctly

---

## 🔍 Database Verification

Check the `password_resets` table:

```sql
-- View all reset tokens
SELECT * FROM password_resets;

-- View only active (unused, not expired) tokens
SELECT * FROM password_resets 
WHERE expires_at > NOW() AND used_at IS NULL;

-- Check user's password was updated
SELECT user_id, user_email, user_password 
FROM users 
WHERE user_email = 'test@example.com';
```

---

## 🐛 Common Issues

### Issue: "Email is required" error
**Solution:** Ensure you're sending the email in the request body.

### Issue: "Reset token is invalid or has expired"
**Solution:** Token expires after 15 minutes. Request a new one.

### Issue: "Failed to update password"
**Solution:** Check database connection and verify user still exists.

### Issue: Reset link not working
**Solution:** Ensure `FRONTEND_URL` environment variable is set correctly.

### Issue: Database table doesn't exist
**Solution:** Run the migration script manually.

---

## 📁 Key Files Reference

### Backend Routes
- Forgot Password: `POST /api/forgot-password`
- Reset Password: `POST /api/reset-password`

### Frontend Routes
- Forgot Password Page: `/forgot-password`
- Reset Password Page: `/reset-password?token=...`

### Log Files to Check
- Backend console output for token generation
- Database query logs
- Frontend console for API call status

---

## 🎯 Next Steps

After testing successfully:

1. **Remove Development Data:**
   - Edit `passwordResetController.js`
   - Remove `resetToken` and `resetLink` from response

2. **Add Email Service:**
   - Install nodemailer: `npm install nodemailer`
   - Configure email transport in `passwordResetService.js`

3. **Add Security:**
   - Implement rate limiting
   - Add CAPTCHA to forms
   - Monitor reset attempts

4. **Production Deployment:**
   - Update `FRONTEND_URL` in production env
   - Test with real email service
   - Verify SSL/HTTPS is working

---

**Ready to test?** Start with Test Scenario 1! 🚀
