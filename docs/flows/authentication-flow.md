///////////////////////////////////////////////////////////////////////
// =============== AUTHENTICATION FLOW DOCUMENTATION =============== //
///////////////////////////////////////////////////////////////////////

/**
 * FLOW PURPOSE:
 * Complete user authentication flow including registration, login, logout,
 * session management, password reset, and cart merge on authentication.
 * 
 * SYSTEMS INVOLVED: AuthContext, Backend Auth Service, Database, Session Management
 * LAST UPDATED: December 29, 2025
 * VERSION: 2.0
 */

---

## 📋 Overview

The **Authentication Flow** manages user identity verification, session creation, and access control throughout the Orbis platform. It includes:

- **User Registration** with profile creation
- **User Login** with email/password
- **Session Persistence** across page reloads
- **Cart Merge** when guest becomes user
- **Password Reset** for account recovery
- **Logout** with session destruction
- **Context Management** via AuthContext
- **Security** with encrypted passwords and secure cookies

---

## 🔄 Main Authentication Flow

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#D4AF37','primaryTextColor':'#000','primaryBorderColor':'#000','lineColor':'#D4AF37','secondaryColor':'#1a1a1a','tertiaryColor':'#333'}}}%%
graph TD
    Start([User Visits App]):::gold --> AppInit[App Initializes]:::black
    
    AppInit --> CheckSession[Check Session/LocalStorage]:::gold
    CheckSession --> SessionExists{Session Valid?}:::gold
    
    SessionExists -->|Yes| RestoreUser[Restore User Data]:::black
    SessionExists -->|No| NoAuth[No Auth State]:::error
    
    RestoreUser --> UserLoggedIn[User Logged In]:::gold
    NoAuth --> ShowNav[Show Login Button]:::gold
    
    UserLoggedIn --> NavBar[Display NavBar with User Menu]:::black
    ShowNav --> NavBar
    
    NavBar --> UserAction{User Action}:::gold
    
    UserAction -->|Click Login| OpenLoginModal[Open Login Modal]:::black
    UserAction -->|Already Logged In| UserMenu[Show Profile Menu]:::black
    UserAction -->|View Protected Route| AuthCheck{Is Authenticated?}:::gold
    
    AuthCheck -->|No| RedirectLogin[Redirect to Login]:::error
    AuthCheck -->|Yes| AllowAccess[Allow Access]:::gold
    
    OpenLoginModal --> EnterEmail[Enter Email Address]:::black
    EnterEmail --> EnterPassword[Enter Password]:::black
    EnterPassword --> SubmitLogin[Submit Login Form]:::gold
    
    SubmitLogin --> ValidateEmail{Email Valid?}:::gold
    ValidateEmail -->|No| EmailError[Show Email Error]:::error
    EmailError --> EnterEmail
    
    ValidateEmail -->|Yes| CheckDB{Email Exists?}:::gold
    CheckDB -->|No| UserNotFound[Invalid Credentials Error]:::error
    UserNotFound --> EnterEmail
    
    CheckDB -->|Yes| ValidatePassword{Password Correct?}:::gold
    ValidatePassword -->|No| PasswordError[Invalid Credentials Error]:::error
    PasswordError --> EnterPassword
    
    ValidatePassword -->|Yes| CreateSession[Create Session]:::black
    CreateSession --> SetAuthContext[Set AuthContext User]:::gold
    SetAuthContext --> CheckGuestCart{Guest Cart Exists?}:::gold
    
    CheckGuestCart -->|Yes| MergeCart[Merge Guest Cart to User]:::black
    CheckGuestCart -->|No| SkipMerge[Continue]:::black
    
    MergeCart --> DispatchEvent[Dispatch cartUpdated Event]:::gold
    DispatchEvent --> CloseModal[Close Login Modal]:::black
    SkipMerge --> CloseModal
    
    CloseModal --> UserLoggedIn
    
    UserMenu --> ProfileOptions{User Choice}:::gold
    ProfileOptions -->|View Profile| GoProfile[Navigate to Profile]:::black
    ProfileOptions -->|Edit Profile| EditProf[Edit Profile Page]:::black
    ProfileOptions -->|Change Password| ChangePW[Change Password Page]:::black
    ProfileOptions -->|Logout| LogoutStart[Start Logout]:::black
    
    LogoutStart --> DestroySession[Destroy Session]:::black
    DestroySession --> ClearAuth[Clear AuthContext]:::gold
    DestroySession --> ClearStorage[Clear LocalStorage]:::black
    ClearAuth --> ClearCookie[Clear Session Cookie]:::gold
    ClearCookie --> Redirect[Redirect to Home]:::gold
    Redirect --> NoAuth
    
    classDef gold fill:#D4AF37,stroke:#000,stroke-width:2px,color:#000
    classDef black fill:#1a1a1a,stroke:#D4AF37,stroke-width:2px,color:#D4AF37
    classDef error fill:#cc0000,stroke:#000,stroke-width:2px,color:#fff
```

---

## 🔑 Registration Flow

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#D4AF37','primaryTextColor':'#000','primaryBorderColor':'#000','lineColor':'#D4AF37','secondaryColor':'#1a1a1a','tertiaryColor':'#333'}}}%%
graph TD
    Start([User Clicks Register]):::gold --> RegisterPage[Navigate to /register]:::black
    
    RegisterPage --> Section1[Section 1: Personal Details]:::gold
    Section1 --> FirstName[Enter First Name]:::black
    FirstName --> LastName[Enter Last Name]:::black
    
    LastName --> Section2[Section 2: Profile]:::gold
    Section2 --> Email[Enter Email]:::black
    Email --> ValidateEmail{Email Unique?}:::gold
    ValidateEmail -->|No| EmailExists[Show Email Taken Error]:::error
    EmailExists --> Email
    ValidateEmail -->|Yes| Password[Enter Password]:::black
    
    Password --> ValidatePassword{Password Strong?}:::gold
    ValidatePassword -->|No| PasswordWeak[Show Requirements]:::error
    PasswordWeak --> Password
    ValidatePassword -->|Yes| Confirm[Confirm Password]:::black
    
    Confirm --> MatchCheck{Passwords Match?}:::gold
    MatchCheck -->|No| NoMatch[Show Mismatch Error]:::error
    NoMatch --> Confirm
    MatchCheck -->|Yes| Nickname[Enter Nickname Optional]:::black
    
    Nickname --> AvatarSection[Avatar Upload Optional]:::gold
    AvatarSection --> SelectAvatar[Select Image File]:::black
    SelectAvatar --> ValidateImage{Valid Image?}:::gold
    ValidateImage -->|No| ImageError[Show Error]:::error
    ImageError --> SelectAvatar
    ValidateImage -->|Yes| ShowPreview[Show Preview]:::black
    ShowPreview --> ConfirmImage{Keep Image?}:::gold
    ConfirmImage -->|No| SelectAvatar
    ConfirmImage -->|Yes| Section3[Section 3: Address]:::gold
    SelectAvatar -->|Skip Avatar| Section3
    
    Section3 --> Address[Enter Address]:::black
    Address --> City[Enter City]:::black
    City --> State[Enter State]:::black
    State --> ZipCode[Enter Zip Code]:::black
    ZipCode --> Country[Select Country]:::black
    
    Country --> ValidateForm{All Valid?}:::gold
    ValidateForm -->|No| ShowErrors[Display Errors]:::error
    ShowErrors --> FixErrors[Fix Issues]:::black
    FixErrors --> ValidateForm
    
    ValidateForm -->|Yes| SubmitReg[Submit Registration]:::gold
    SubmitReg --> ServerCreate[Create User Account]:::black
    ServerCreate --> CreateProfile[Create Profile Record]:::black
    CreateProfile --> UploadFile[Upload Avatar to Server]:::black
    
    UploadFile --> CreateSession[Create Session]:::gold
    CreateSession --> SetContext[Set AuthContext]:::black
    SetContext --> StoreLocal[Store User in LocalStorage]:::gold
    
    StoreLocal --> Success[Show Success Message]:::gold
    Success --> Redirect[Redirect to Home]:::black
    Redirect --> LoggedIn([User Logged In]):::gold
    
    classDef gold fill:#D4AF37,stroke:#000,stroke-width:2px,color:#000
    classDef black fill:#1a1a1a,stroke:#D4AF37,stroke-width:2px,color:#D4AF37
    classDef error fill:#cc0000,stroke:#000,stroke-width:2px,color:#fff
```

---

## 🔐 Session Management Flow

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#D4AF37','primaryTextColor':'#000','primaryBorderColor':'#000','lineColor':'#D4AF37','secondaryColor':'#1a1a1a','tertiaryColor':'#333'}}}%%
graph TD
    App([App Loads]):::gold --> CheckStorage{User in LocalStorage?}:::gold
    
    CheckStorage -->|Yes| RestoreLocal[Restore User Object]:::black
    CheckStorage -->|No| SessionRequest[Request /api/session]:::gold
    
    RestoreLocal --> SetContext[Set AuthContext User]:::black
    SessionRequest --> SessionReturns{Session Valid?}:::gold
    
    SessionReturns -->|Yes| SessionUser[Get User from Session]:::black
    SessionReturns -->|No| NoUser[No User Auth]:::error
    
    SessionUser --> SetContext
    NoUser --> SkipAuth[Skip Auth]:::black
    SetContext --> UpdateLocal[Update LocalStorage]:::black
    SkipAuth --> UpdateLocal
    
    UpdateLocal --> LoadingDone[Set Loading False]:::gold
    LoadingDone --> RenderApp[Render App]:::black
    
    RenderApp --> UserAction{User Action}:::gold
    UserAction -->|Make Request| AddCookie[Include Session Cookie]:::black
    AddCookie --> Request[Send API Request]:::gold
    
    Request --> ServerCheck[Server Validates Session]:::black
    ServerCheck --> IsValid{Session Valid?}:::gold
    
    IsValid -->|Yes| ProcessRequest[Process Request]:::black
    IsValid -->|No| Auth401[Return 401 Unauthorized]:::error
    
    ProcessRequest --> CheckExpire[Check Expiration]:::gold
    CheckExpire --> Expired{Expired?}:::gold
    Expired -->|Yes| DestroySession[Destroy Session]:::error
    Expired -->|No| ExtendSession[Extend Session Duration]:::black
    
    ExtendSession --> ResponseOK[Return Success]:::gold
    ResponseOK --> UserSees[User Sees Response]:::black
    
    DestroySession --> ClearCookie[Clear Cookie]:::error
    ClearCookie --> AuthNeeded[User Needs to Login]:::error
    
    Auth401 --> AuthNeeded
    
    classDef gold fill:#D4AF37,stroke:#000,stroke-width:2px,color:#000
    classDef black fill:#1a1a1a,stroke:#D4AF37,stroke-width:2px,color:#D4AF37
    classDef error fill:#cc0000,stroke:#000,stroke-width:2px,color:#fff
```

---

## 🛒 Cart Merge on Login Flow

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#D4AF37','primaryTextColor':'#000','primaryBorderColor':'#000','lineColor':'#D4AF37','secondaryColor':'#1a1a1a','tertiaryColor':'#333'}}}%%
graph TD
    Start([Guest Logs In]):::gold --> CheckCart{Guest Cart Items?}:::gold
    
    CheckCart -->|No Items| SkipMerge[Skip Merge]:::black
    CheckCart -->|Has Items| FindGuest[Find Cart by session_id]:::black
    
    FindGuest --> CheckUser{User Cart Exists?}:::gold
    CheckUser -->|No Cart| CreateUserCart[Create User Cart]:::black
    CheckUser -->|Has Cart| GetUserCart[Get User Cart]:::black
    
    CreateUserCart --> StartMerge[Begin Merge Process]:::gold
    GetUserCart --> StartMerge
    
    StartMerge --> CopyItems[Copy Guest Items to User Cart]:::black
    CopyItems --> HandleDupes{Duplicate Items?}:::gold
    
    HandleDupes -->|Yes| SumQty[Sum Quantities]:::black
    HandleDupes -->|No| AddNew[Add New Items]:::black
    
    SumQty --> UpdateDB[Update Database]:::black
    AddNew --> UpdateDB
    
    UpdateDB --> RemoveGuest[Remove Guest Cart]:::black
    RemoveGuest --> DispatchEvent[Dispatch cartUpdated Event]:::gold
    
    DispatchEvent --> NotifyBadge[Cart Badge Updates]:::black
    NotifyBadge --> RefreshCart[Cart Page Refreshes if Open]:::gold
    
    RefreshCart --> Success[Merge Complete]:::gold
    SkipMerge --> Success
    
    Success --> Continue[Continue App Normally]:::black
    
    classDef gold fill:#D4AF37,stroke:#000,stroke-width:2px,color:#000
    classDef black fill:#1a1a1a,stroke:#D4AF37,stroke-width:2px,color:#D4AF37
    classDef error fill:#cc0000,stroke:#000,stroke-width:2px,color:#fff
```

---

## 🔑 Authentication State Components

### AuthContext
- **Location:** `frontend/src/pages/common/context/AuthContext.jsx`
- **Provides:** `user`, `loading`, `login()`, `logout()`, `setUser()`
- **Manages:** Global authentication state
- **Persists:** User data in localStorage
- **Restores:** Session on app load

### LoginModal Component
- **Trigger:** Click "Login" button in MainNavBar
- **Fields:** Email, Password
- **Validation:** Email format, password required
- **Success:** Creates session, closes modal, updates context
- **Error:** Shows error messages, allows retry

### RegisterForm Component
- **Route:** `/register`
- **Sections:** Personal, Profile, Address
- **Optional:** Avatar upload
- **Validation:** Email unique, password strength, field completion
- **Success:** Creates account, session, redirects home

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)

---

## 🔐 Security Features

### Password Security
- **Hashing:** bcrypt with 10 salt rounds
- **Storage:** Only hash stored, never plain text
- **Comparison:** Safe constant-time comparison
- **Requirements:** Min 8 chars, uppercase, lowercase, number

### Session Security
- **httpOnly:** Prevents JavaScript access (XSS protection)
- **Secure:** Only sent over HTTPS (in production)
- **SameSite:** Lax setting (CSRF protection)
- **Duration:** 30 days default
- **Storage:** Database (not in-memory)

### CORS & Validation
- **withCredentials:** true on all requests
- **Frontend URL:** Validated on backend
- **Session Validation:** Every request checked
- **User Validation:** Account status verified

---

## 🎯 Authentication States

### States
- `loading` - App initializing, checking session
- `authenticated` - User logged in, context has user
- `unauthenticated` - No user, guest mode
- `error` - Authentication failed

### Transitions
```
Loading → Authenticated (session restored)
Loading → Unauthenticated (no session)
Unauthenticated → Authenticated (login/register)
Authenticated → Unauthenticated (logout)
```

---

## 📱 User Experience

### On Login Success
1. Modal closes
2. NavBar shows user name/avatar
3. Profile menu appears
4. Cart merges (if guest items)
5. User can access protected pages

### On Logout
1. Session destroyed
2. Context cleared
3. LocalStorage cleared
4. Redirected to home
5. Login button appears in navbar

### On Session Expire
1. API returns 401
2. Session cleared automatically
3. User redirected to login
4. Message shown: "Please login again"

---

## 🔗 Related Documentation

- **[Authentication System Quickstart](../quickstart/authentication.md)** - Detailed implementation
- **[Password Reset Flow](./password-reset-flow.md)** - Reset process
- **[Profile Management Flow](./profile-management-flow.md)** - Profile editing
- **[Shop & Cart Flow](./shop-cart-flow.md)** - Cart merge details
- **[Main Application Flow](./main-application-flow.md)** - Overall navigation

---

**Document Version:** 2.0  
**Last Updated:** December 29, 2025  
**Status:** ✅ Comprehensive
