# Authentication Flow

This document details the user authentication process including login, registration, logout, and session management.

---

## Flow Diagram

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#D4AF37','primaryTextColor':'#000','primaryBorderColor':'#000','lineColor':'#D4AF37','secondaryColor':'#1a1a1a','tertiaryColor':'#333'}}}%%
graph TD
    A[User Action]:::gold --> B{Authenticated?}:::gold
    
    B -->|No| Login[Login Modal]:::black
    B -->|Yes| Profile[Profile Menu]:::black
    
    Login --> ValidateCredentials{Valid?}:::gold
    ValidateCredentials -->|Yes| CreateSession[Create Session]:::black
    ValidateCredentials -->|No| Error[Show Error]:::error
    
    CreateSession --> SetContext[Set User Context]:::black
    SetContext --> Redirect[Redirect Home]:::gold
    
    Login --> ForgotPW[Forgot Password]:::black
    ForgotPW --> EmailReset[Email Reset Link]:::gold
    EmailReset --> ResetModal[Reset Password]:::black
    ResetModal --> UpdatePW[Update Password]:::gold
    UpdatePW --> Success[Success Message]:::gold
    
    Login --> Register[Register]:::black
    Register --> FillForm[Fill Form]:::gold
    FillForm --> Validate{Valid?}:::gold
    Validate -->|Yes| CreateUser[Create Account]:::black
    Validate -->|No| ShowErrors[Show Errors]:::error
    CreateUser --> CreateSession
    
    Profile --> EditProfile[Edit Profile]:::gold
    Profile --> LogoutUser[Logout]:::black
    
    EditProfile --> UpdateProfile[Update Info]:::black
    EditProfile --> UploadAvatar[Upload Avatar]:::black
    EditProfile --> DeleteAvatar[Delete Avatar]:::black
    UpdateProfile --> SaveChanges[Save Changes]:::gold
    
    LogoutUser --> DestroySession[Destroy Session]:::black
    DestroySession --> ClearContext[Clear Context]:::gold
    
    classDef gold fill:#D4AF37,stroke:#000,stroke-width:2px,color:#000
    classDef black fill:#1a1a1a,stroke:#D4AF37,stroke-width:2px,color:#D4AF37
    classDef error fill:#cc0000,stroke:#000,stroke-width:2px,color:#fff
```

---

## Authentication Components

### Login
- Email and password validation
- Session creation on success
- Error handling for invalid credentials

### Registration
- Multi-step form (personal details, profile, address)
- Optional avatar upload
- Password strength validation (8+ chars, uppercase, lowercase, number, special char)
- Automatic session creation after registration

### Logout
- Session destruction
- Context clearing
- Redirect to home page

### Session Management
- Persistent sessions using cookies
- Session restoration on page load
- Automatic timeout handling

---

## Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (@$!%*?&#)

---

**Related Documents:**
- [Profile Management Flow](./profile-management-flow.md)
- [Password Reset Flow](./password-reset-flow.md)
