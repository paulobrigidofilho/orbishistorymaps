<!--
  ORBIS Authentication Flow Chart
  
  Document Type: Visual Flowchart & Decision Tree
  Purpose: Visual representation of authentication processes
  
  For detailed implementation: see /docs/quickstart/authentication.md
  For sequential flow: see /docs/flows/authentication-flow.md
  
  Updated: December 29, 2025
-->

# 🔐 Authentication Flow Chart

## 📊 Main Authentication Decision Tree

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#D4AF37','primaryTextColor':'#000','primaryBorderColor':'#000','lineColor':'#D4AF37','secondaryColor':'#1a1a1a','tertiaryColor':'#333'}}}%%
graph TD
    Start([User Visits App]):::gold --> CheckSession{Session<br/>in Cookie?}:::gold
    
    CheckSession -->|Yes| ValidateSession[Validate Session<br/>Token]:::black
    CheckSession -->|No| CheckLocal{User in<br/>LocalStorage?}:::gold
    
    ValidateSession --> SessionValid{Session<br/>Valid?}:::gold
    SessionValid -->|Yes| RestoreDB[Get User from<br/>Database]:::black
    SessionValid -->|No| ClearBad[Clear Session<br/>Cookie]:::error
    
    CheckLocal -->|Yes| LoadFromStorage[Load User from<br/>LocalStorage]:::black
    CheckLocal -->|No| NoAuth[No Authentication]:::black
    
    RestoreDB --> SetAuth[Set AuthContext<br/>Loading: false]:::gold
    LoadFromStorage --> SetAuth
    ClearBad --> NoAuth
    NoAuth --> SetAuth
    
    SetAuth --> LoadApp[Render App]:::black
    LoadApp --> UserAction{User<br/>Action?}:::gold
    
    UserAction -->|Clicks Login| ShowModal[Show Login Modal]:::gold
    UserAction -->|Clicks Register| ShowRegister[Redirect to<br/>/register]:::gold
    UserAction -->|Continues| ContinueAs[Continue as<br/>Guest]:::black
    
    ShowModal --> EnterCreds[Enter Email &<br/>Password]:::black
    EnterCreds --> ValidateCreds{Email &<br/>Password<br/>Valid?}:::gold
    
    ValidateCreds -->|No| ErrorCreds[Show Validation<br/>Error]:::error
    ErrorCreds --> EnterCreds
    
    ValidateCreds -->|Yes| SendLogin[Send to<br/>/api/auth/login]:::gold
    SendLogin --> CheckUser{User<br/>Exists?}:::gold
    
    CheckUser -->|No| UserNotFound[Return<br/>User Not Found]:::error
    UserNotFound --> ErrorLogin[Show Error<br/>Message]:::error
    ErrorLogin --> EnterCreds
    
    CheckUser -->|Yes| CheckPassword{Password<br/>Correct?}:::gold
    CheckPassword -->|No| BadPassword[Return<br/>Invalid Password]:::error
    BadPassword --> ErrorLogin
    
    CheckPassword -->|Yes| CheckStatus{Account<br/>Active?}:::gold
    CheckStatus -->|Banned| AccountBanned[Return Account<br/>Banned]:::error
    AccountBanned --> ErrorLogin
    
    CheckStatus -->|Verified| CreateSession[Create Session<br/>in Database]:::gold
    CreateSession --> SetCookie[Set Session<br/>Cookie httpOnly]:::black
    SetCookie --> ReturnUser[Return User<br/>Object]:::gold
    
    ReturnUser --> ClientReceive[Client Receives<br/>User & Session]:::black
    ClientReceive --> UpdateContext[Update AuthContext]:::gold
    UpdateContext --> UpdateStorage[Store User in<br/>LocalStorage]:::black
    UpdateStorage --> CloseModal[Close Modal]:::gold
    CloseModal --> RefreshUI[Refresh UI]:::black
    RefreshUI --> LoggedIn([User Logged In]):::gold
    
    ShowRegister --> RegisterFlow([See Registration<br/>Flow]):::gold
    ContinueAs --> GuestMode([App in Guest Mode]):::black
    
    classDef gold fill:#D4AF37,stroke:#000,stroke-width:2px,color:#000
    classDef black fill:#1a1a1a,stroke:#D4AF37,stroke-width:2px,color:#D4AF37
    classDef error fill:#cc0000,stroke:#000,stroke-width:2px,color:#fff
```

---

## 📋 Registration Process Steps

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#D4AF37','primaryTextColor':'#000','primaryBorderColor':'#000','lineColor':'#D4AF37','secondaryColor':'#1a1a1a','tertiaryColor':'#333'}}}%%
graph LR
    Step1["<b>STEP 1</b><br/>Personal Details<br/>First & Last Name"]:::gold -->
    Step2["<b>STEP 2</b><br/>Account Setup<br/>Email & Password"]:::gold -->
    Step3["<b>STEP 3</b><br/>Profile Info<br/>Avatar & Nickname"]:::gold -->
    Step4["<b>STEP 4</b><br/>Address<br/>Shipping Info"]:::gold -->
    Step5["<b>STEP 5</b><br/>Validation<br/>Check All Fields"]:::gold -->
    Step6["<b>STEP 6</b><br/>Account Created<br/>Logged In"]:::gold
    
    classDef gold fill:#D4AF37,stroke:#000,stroke-width:2px,color:#000,font-weight:bold
```

---

## 🔐 Session Validation Flow (Per Request)

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#D4AF37','primaryTextColor':'#000','primaryBorderColor':'#000','lineColor':'#D4AF37','secondaryColor':'#1a1a1a','tertiaryColor':'#333'}}}%%
graph TD
    ClientReq([Client Makes<br/>API Request]):::gold -->
    IncludeCookie[Include Session<br/>Cookie]:::black -->
    SendReq[Send Request<br/>to Backend]:::gold -->
    
    ServerRcv[Backend Receives<br/>Request]:::black -->
    ExtractCookie{Cookie<br/>Present?}:::gold -->
    
    ExtractCookie -->|No| Return401["Return 401<br/>Unauthorized"]:::error -->
    ClientError[Client Error:<br/>Login Required]:::error -->
    ClearSession[Clear LocalStorage<br/>& Context]:::error -->
    ShowLogin[Show Login Modal]:::error -->
    EndError([Try Again]):::error
    
    ExtractCookie -->|Yes| FindSession[Find Session<br/>in Database]:::black -->
    SessionExists{Session<br/>Found?}:::gold -->
    
    SessionExists -->|No| Return401
    SessionExists -->|Yes| CheckExpire{Session<br/>Expired?}:::gold -->
    
    CheckExpire -->|Yes| DestroySession[Destroy Session<br/>Record]:::error -->
    Return401
    
    CheckExpire -->|No| CheckUser[Get Associated<br/>User]:::black -->
    UserActive{User<br/>Active?}:::gold -->
    
    UserActive -->|No| Return401
    UserActive -->|Yes| ExtendExp[Extend Session<br/>Expiration]:::gold -->
    AllowRequest[Allow Request<br/>Processing]:::gold -->
    
    AllowRequest --> Process[Execute Request<br/>Logic]:::black -->
    SendResp[Send Success<br/>Response]:::gold -->
    
    SendResp --> ClientReceive[Client Receives<br/>Response]:::black -->
    UpdateLocal[Update LocalStorage<br/>Expiry Info]:::black -->
    Continue([Continue]):::gold
    
    classDef gold fill:#D4AF37,stroke:#000,stroke-width:2px,color:#000
    classDef black fill:#1a1a1a,stroke:#D4AF37,stroke-width:2px,color:#D4AF37
    classDef error fill:#cc0000,stroke:#000,stroke-width:2px,color:#fff
```

---

## 🗝️ Logout & Session Cleanup Flow

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#D4AF37','primaryTextColor':'#000','primaryBorderColor':'#000','lineColor':'#D4AF37','secondaryColor':'#1a1a1a','tertiaryColor':'#333'}}}%%
graph TD
    UserClick([User Clicks<br/>Logout]):::gold -->
    OnClick[onClick Handler<br/>Triggered]:::black -->
    
    CallLogout[Call logout()<br/>from AuthContext]:::gold -->
    
    MakeRequest[Send DELETE<br/>/api/auth/logout]:::black -->
    
    ServerReceive[Backend Receives<br/>Logout Request]:::gold -->
    FindSession[Find Session<br/>Record]:::black -->
    
    DeleteSession[Delete Session<br/>from Database]:::gold -->
    ClearCookie[Return Clear-Cookie<br/>Header]:::black -->
    
    ClientReceive[Client Receives<br/>Response]:::gold -->
    
    RemoveLocal[Remove User from<br/>LocalStorage]:::black -->
    ClearContext[Clear AuthContext<br/>user = null]:::gold -->
    
    ResetState[Set loading: false]:::black -->
    
    ClearBrowser[Browser Clears<br/>Session Cookie]:::gold -->
    
    RefreshUI[Update UI<br/>Hide Protected Elements]:::black -->
    
    Redirect[Redirect to<br/>Home Page]:::gold -->
    
    GuestMode([App in Guest Mode]):::black
    
    classDef gold fill:#D4AF37,stroke:#000,stroke-width:2px,color:#000
    classDef black fill:#1a1a1a,stroke:#D4AF37,stroke-width:2px,color:#D4AF37
    classDef error fill:#cc0000,stroke:#000,stroke-width:2px,color:#fff
```

---

## 🔄 Protected Route Access

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#D4AF37','primaryTextColor':'#000','primaryBorderColor':'#000','lineColor':'#D4AF37','secondaryColor':'#1a1a1a','tertiaryColor':'#333'}}}%%
graph TD
    Route["User Navigates<br/>to Protected Route"]:::gold -->
    CheckAuth{AuthContext<br/>Has User?}:::gold -->
    
    CheckAuth -->|Loading| ShowSpin[Show Spinner/Loading]:::black -->
    WaitLoad[Wait for Session<br/>Restoration]:::black -->
    CheckAuth
    
    CheckAuth -->|No User| ShowLogin[Show Login Required<br/>Message]:::gold -->
    ShowModal[Display Login Modal]:::black -->
    WaitLogin[Wait for User<br/>Action]:::black -->
    
    WaitLogin --> UserLogins{User<br/>Logs In?}:::gold -->
    UserLogins -->|Yes| RetryRoute[Retry Navigation<br/>to Route]:::gold -->
    RetryRoute --> CheckAuth
    
    UserLogins -->|No| Home[Redirect to<br/>Home]:::error -->
    EndDeny([Access Denied]):::error
    
    CheckAuth -->|Has User| CheckRole{User Has<br/>Required<br/>Role?}:::gold -->
    
    CheckRole -->|Yes| CheckStatus{Account<br/>Status<br/>Valid?}:::gold -->
    
    CheckStatus -->|Yes| RenderPage[Render<br/>Protected Page]:::gold -->
    EndAllow([Page Loaded]):::gold
    
    CheckStatus -->|No| InvalidUser[Show Account<br/>Error]:::error -->
    LogoutAuto[Auto Logout]:::error -->
    ShowLogin
    
    CheckRole -->|No| Forbidden[Show Forbidden<br/>403 Page]:::error -->
    EndDeny
    
    classDef gold fill:#D4AF37,stroke:#000,stroke-width:2px,color:#000
    classDef black fill:#1a1a1a,stroke:#D4AF37,stroke-width:2px,color:#D4AF37
    classDef error fill:#cc0000,stroke:#000,stroke-width:2px,color:#fff
```

---

## 📱 Component Interaction Diagram

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#D4AF37','primaryTextColor':'#000','primaryBorderColor':'#000','lineColor':'#D4AF37','secondaryColor':'#1a1a1a','tertiaryColor':'#333'}}}%%
graph TB
    subgraph Frontend["Frontend Layer"]
        direction LR
        MNB["MainNavBar<br/>(Login Button)"]:::gold
        LM["LoginModal<br/>(Email/Password)"]:::gold
        RF["RegisterForm<br/>(Multi-step)"]:::gold
        AUTH["AuthContext<br/>(Global State)"]:::black
    end
    
    subgraph Communication["Communication"]
        direction LR
        REQ["Axios Requests<br/>(withCredentials)"]:::gold
        COOKIE["Session Cookie<br/>(httpOnly)"]:::black
    end
    
    subgraph Backend["Backend Layer"]
        direction LR
        API["Auth Routes<br/>(/api/auth/*)"]:::gold
        SERVICE["AuthService<br/>(Business Logic)"]:::black
        DB["PostgreSQL<br/>(Users & Sessions)"]:::gold
    end
    
    MNB -->|click| LM
    LM -->|submit| REQ
    MNB -->|click| RF
    RF -->|submit| REQ
    
    REQ -->|send| API
    REQ -->|include| COOKIE
    
    API -->|call| SERVICE
    SERVICE -->|query| DB
    SERVICE -->|create| COOKIE
    
    API -->|return| REQ
    COOKIE -->|store| AUTH
    
    AUTH -->|provides| MNB
    AUTH -->|provides| RF
    
    classDef gold fill:#D4AF37,stroke:#000,stroke-width:2px,color:#000
    classDef black fill:#1a1a1a,stroke:#D4AF37,stroke-width:2px,color:#D4AF37
```

---

## 🔑 Key Decision Points

| Decision Point | Yes Path | No Path |
|---|---|---|
| **Session Valid?** | Restore user session | Treat as guest |
| **User Exists?** | Check password | Return "not found" error |
| **Password Correct?** | Create session | Return "invalid password" |
| **Account Active?** | Proceed to login | Return "account inactive" |
| **Email Unique?** | Create account | Return "email taken" error |
| **Password Strong?** | Continue | Show requirements |
| **User Has Role?** | Show page | Show "forbidden" error |

---

## 🎯 API Endpoints Summary

| Endpoint | Method | Payload | Response | Purpose |
|---|---|---|---|---|
| `/api/auth/login` | POST | `{email, password}` | `{user, sessionId}` | User login |
| `/api/auth/register` | POST | `{firstName, lastName, email, password, ...}` | `{user, sessionId}` | New account |
| `/api/auth/logout` | DELETE | - | `{message}` | Destroy session |
| `/api/session` | GET | - | `{user} or {error}` | Verify session |
| `/api/auth/password-reset` | POST | `{email}` | `{message}` | Reset request |

---

## 🛡️ Security Validation Points

- ✅ HTTPS enforcement (production)
- ✅ Password hashing (bcrypt 10 rounds)
- ✅ Session token generation (secure random)
- ✅ httpOnly cookie flag
- ✅ SameSite=Lax CSRF protection
- ✅ Email uniqueness validation
- ✅ Password strength requirements
- ✅ Account status checking
- ✅ Session expiration (30 days)
- ✅ Secure logout clearing

---

## 🔗 Related Documentation

- **[Authentication Quickstart](../quickstart/authentication.md)** - Implementation details
- **[Authentication Flow](./authentication-flow.md)** - Sequential processes
- **[Shop & Cart Flow](./shop-cart-flow.md)** - Login integration
- **[Profile Management](./profile-management-flow.md)** - User profile

---

**Chart Version:** 1.0  
**Last Updated:** December 29, 2025  
**Status:** ✅ Complete