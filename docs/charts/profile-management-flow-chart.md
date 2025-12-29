<!--
  ORBIS Profile Management Flow Chart
  
  Document Type: Visual Flowchart & Decision Tree
  Purpose: Visual representation of profile management processes
  
  For detailed implementation: see /docs/quickstart/authentication.md
  For sequential flow: see /docs/flows/profile-management-flow.md
  
  Updated: December 29, 2025
-->

# 👤 Profile Management Flow Chart

## 📊 Profile Access & Editing Decision Tree

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#D4AF37','primaryTextColor':'#000','primaryBorderColor':'#000','lineColor':'#D4AF37','secondaryColor':'#1a1a1a','tertiaryColor':'#333'}}}%%
graph TD
    Start([User Accesses<br/>Profile]):::gold --> CheckAuth{User<br/>Logged In?}:::gold
    
    CheckAuth -->|No| Redirect[Redirect to<br/>Login Page]:::error --> LoginReq([Login Required]):::error
    
    CheckAuth -->|Yes| FetchData[Fetch User Profile<br/>from Database]:::black -->
    DataSuccess{Data<br/>Loaded?}:::gold -->
    
    DataSuccess -->|Error| APIErr[Show Error<br/>Message]:::error --> Retry[Retry Load]:::black --> FetchData
    
    DataSuccess -->|Success| CheckOwn{Viewing Own<br/>Profile?}:::gold -->
    
    CheckOwn -->|Other User| ViewOnly[View-Only Mode<br/>Read Only]:::black -->
    DisplayProfile[Display Profile<br/>Information]:::gold -->
    EndView([Profile Viewed]):::black
    
    CheckOwn -->|Own Profile| EditMode[Edit Mode<br/>Editable Form]:::black -->
    ShowForm[Display Form<br/>with Fields]:::gold -->
    
    ShowForm --> WaitAction[Wait for User<br/>Action]:::black -->
    UserAction{User<br/>Action?}:::gold -->
    
    UserAction -->|Edit Personal| PersonalEdit[Edit Personal<br/>Details]:::gold
    UserAction -->|Edit Address| AddressEdit[Edit Address]:::gold
    UserAction -->|Upload Avatar| AvatarUpload[Upload Avatar]:::gold
    UserAction -->|Change Password| PasswordChange[Change Password]:::gold
    UserAction -->|Save| SaveAll[Save All<br/>Changes]:::gold
    UserAction -->|Cancel| CancelEdit[Cancel<br/>Edit]:::error
    
    PersonalEdit --> PersonalFlow[→ See Personal<br/>Edit Diagram]:::black
    AddressEdit --> AddressFlow[→ See Address<br/>Edit Diagram]:::black
    AvatarUpload --> AvatarFlow[→ See Avatar<br/>Upload Diagram]:::black
    PasswordChange --> PasswordFlow[→ See Password<br/>Change Diagram]:::black
    
    SaveAll --> ValidateAll{All Fields<br/>Valid?}:::gold -->
    |No| ShowErr[Show Validation<br/>Errors]:::error -->
    FixErr[Fix Issues]:::black -->
    ValidateAll
    
    ValidateAll -->|Yes| SendAPI[Send UPDATE<br/>to /api/profile]:::gold -->
    ServerProc[Server Validates<br/>& Updates DB]:::black -->
    UpdateOK{Update<br/>Success?}:::gold -->
    
    UpdateOK -->|No| APIError[Return Error<br/>Details]:::error --> ShowAPIErr[Show Error]:::error --> SaveAll
    UpdateOK -->|Yes| UpdateLocal[Update AuthContext<br/>& LocalStorage]:::gold -->
    ShowSucc[Show Success<br/>Message]:::gold -->
    UpdateNav[NavBar Reflects<br/>Changes]:::black -->
    Done([Changes Saved]):::gold
    
    CancelEdit --> Discard[Discard All<br/>Changes]:::error --> ShowForm
    
    classDef gold fill:#D4AF37,stroke:#000,stroke-width:2px,color:#000
    classDef black fill:#1a1a1a,stroke:#D4AF37,stroke-width:2px,color:#D4AF37
    classDef error fill:#cc0000,stroke:#000,stroke-width:2px,color:#fff
```

---

## ✏️ Personal Details Edit Flow

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#D4AF37','primaryTextColor':'#000','primaryBorderColor':'#000','lineColor':'#D4AF37','secondaryColor':'#1a1a1a','tertiaryColor':'#333'}}}%%
graph TD
    Start([Edit Personal<br/>Details]):::gold -->
    
    FNSection["First Name<br/>(max 50 chars)<br/>required"]:::black -->
    FNValidate{Valid<br/>Name?}:::gold -->
    FNValidate -->|No| FNError["❌ Error<br/>Required, Max 50"]:::error --> FNSection
    FNValidate -->|Yes| FNOK["✓ First Name<br/>Valid"]:::gold -->
    
    LNSection["Last Name<br/>(max 50 chars)<br/>required"]:::black -->
    LNValidate{Valid<br/>Name?}:::gold -->
    LNValidate -->|No| LNError["❌ Error<br/>Required, Max 50"]:::error --> LNSection
    LNValidate -->|Yes| LNOK["✓ Last Name<br/>Valid"]:::gold -->
    
    ESection["Email<br/>(must be unique)<br/>required"]:::black -->
    EValidate{Valid<br/>Email?}:::gold -->
    EValidate -->|Invalid Format| EFormatErr["❌ Invalid<br/>Email Format"]:::error --> ESection
    EValidate -->|Valid Format| EUnique{Email<br/>Unique?}:::gold -->
    EUnique -->|No| EUniqueErr["❌ Email<br/>Already In Use"]:::error --> ESection
    EUnique -->|Yes| EOK["✓ Email<br/>Valid"]:::gold -->
    
    NNSection["Nickname<br/>(max 100 chars)<br/>optional"]:::black -->
    NNValidate{Valid<br/>Length?}:::gold -->
    NNValidate -->|No| NNError["❌ Max 100<br/>characters"]:::error --> NNSection
    NNValidate -->|Yes| NNOK["✓ Nickname<br/>Valid"]:::gold -->
    
    FNOK --> SaveCheck{Save<br/>Changes?}:::gold -->
    LNOK --> SaveCheck
    EOK --> SaveCheck
    NNOK --> SaveCheck
    
    SaveCheck -->|No| Discard[Discard<br/>Changes]:::error --> Cancel([Cancelled]):::error
    SaveCheck -->|Yes| Submit[Submit Personal<br/>Info Update]:::gold -->
    ServerVal[Server Validates<br/>All Fields<br/>& Checks Unique]:::black -->
    ServerOK{Server<br/>Validation<br/>Pass?}:::gold -->
    
    ServerOK -->|No| ServerErr[Return Server<br/>Error Message]:::error --> ShowServerErr[Display Error]:::error --> FNSection
    ServerOK -->|Yes| UpdateDB[Update User<br/>in Database]:::black -->
    ReturnUser[Return Updated<br/>User Object]:::gold -->
    UpdateAuth[Update AuthContext<br/>with New Data]:::black -->
    UpdateStorage[Update LocalStorage]:::gold -->
    ShowSuccess[Show Success<br/>Message]:::gold -->
    Done([Personal Info<br/>Updated]):::gold
    
    classDef gold fill:#D4AF37,stroke:#000,stroke-width:2px,color:#000
    classDef black fill:#1a1a1a,stroke:#D4AF37,stroke-width:2px,color:#D4AF37
    classDef error fill:#cc0000,stroke:#000,stroke-width:2px,color:#fff
```

---

## 🖼️ Avatar Upload Flow

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#D4AF37','primaryTextColor':'#000','primaryBorderColor':'#000','lineColor':'#D4AF37','secondaryColor':'#1a1a1a','tertiaryColor':'#333'}}}%%
graph TD
    Start([Avatar Section]):::gold -->
    DisplayCurrent["Display Current<br/>Avatar or<br/>Default Icon"]:::black -->
    
    Options{User<br/>Action?}:::gold -->
    
    Options -->|Upload New| UploadBtn[Click Upload<br/>Button]:::gold -->
    FileDialog["File Dialog<br/>(accept image/*)"]:::black -->
    
    FileDialog --> FileSelected{File<br/>Selected?}:::gold -->
    FileSelected -->|No| Cancelled([Upload<br/>Cancelled]):::error
    FileSelected -->|Yes| ValidateFile[Validate File]:::gold -->
    
    ValidateFile --> CheckType{Image Type?<br/>JPG/PNG/GIF}:::gold -->
    CheckType -->|Invalid| TypeErr["❌ Show:<br/>JPG, PNG, or<br/>GIF Only"]:::error -->
    FileDialog
    
    CheckType -->|Valid| CheckSize{File Size<br/>≤ 5MB?}:::gold -->
    CheckSize -->|Too Large| SizeErr["❌ Show:<br/>Max 5MB<br/>Current: X MB"]:::error -->
    FileDialog
    
    CheckSize -->|Valid| Preview[Create & Show<br/>Image Preview]:::black -->
    PreviewDisplay["Display<br/>Preview<br/>with Options"]:::gold -->
    
    PreviewDisplay --> PreviewAction{Confirm<br/>Upload?}:::gold -->
    PreviewAction -->|No| CancelPrev[Cancel<br/>Preview]:::error -->
    CancelPrev --> FileDialog
    
    PreviewAction -->|Yes| UploadFile[Upload File<br/>to Server]:::gold -->
    Progress["Show Progress<br/>Bar"]:::black -->
    UploadDone{Upload<br/>Complete?}:::gold -->
    
    UploadDone -->|Error| UploadErr["❌ Show<br/>Upload Error"]:::error -->
    RetryBtn["Retry<br/>Upload"]:::black -->
    UploadFile
    
    UploadDone -->|Success| SaveURL[Save Avatar URL<br/>in Database]:::black -->
    UpdateUser[Update User<br/>Avatar Field]:::gold -->
    UpdateAuth[Update AuthContext<br/>& LocalStorage]:::black -->
    UpdateNav["NavBar Avatar<br/>Updates<br/>Immediately"]:::gold -->
    ShowUploadOK["✓ Show Success<br/>Message"]:::gold -->
    UploadComplete([Avatar<br/>Uploaded]):::gold
    
    Options -->|Delete Avatar| DelBtn[Click Delete<br/>Button]:::gold -->
    ConfirmDel[Show Confirmation<br/>Dialog]:::black -->
    
    ConfirmDel --> DelChoice{Confirm<br/>Delete?}:::gold -->
    DelChoice -->|No| DelCancel([Delete<br/>Cancelled]):::error
    
    DelChoice -->|Yes| DeleteServer[Send DELETE<br/>Request to<br/>/api/profile/avatar]:::gold -->
    ServerDel[Server Deletes<br/>File & Updates<br/>Database]:::black -->
    ClearPath[Clear avatar_url<br/>Field]:::gold -->
    UpdateAuthDel[Update AuthContext<br/>& LocalStorage]:::black -->
    UpdateNavDel["NavBar Shows<br/>Default Icon"]:::gold -->
    ShowDelOK["✓ Show Success<br/>Message"]:::gold -->
    DeleteComplete([Avatar<br/>Deleted]):::gold
    
    Options -->|View Only| ViewAvatar[View Current<br/>Avatar]:::black -->
    ViewComplete([Viewing<br/>Complete]):::black
    
    classDef gold fill:#D4AF37,stroke:#000,stroke-width:2px,color:#000
    classDef black fill:#1a1a1a,stroke:#D4AF37,stroke-width:2px,color:#D4AF37
    classDef error fill:#cc0000,stroke:#000,stroke-width:2px,color:#fff
```

---

## 🔐 Change Password Flow

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#D4AF37','primaryTextColor':'#000','primaryBorderColor':'#000','lineColor':'#D4AF37','secondaryColor':'#1a1a1a','tertiaryColor':'#333'}}}%%
graph TD
    Start([Change Password<br/>Section]):::gold -->
    
    CurrentPW["Current Password<br/>(verify identity)<br/>required"]:::black -->
    CurrentValidate{Password<br/>Entered?}:::gold -->
    CurrentValidate -->|No| CurrentErr["❌ Field<br/>Required"]:::error -->
    CurrentPW
    CurrentValidate -->|Yes| CurrentOK["✓ Password<br/>Entered"]:::gold -->
    
    NewPW["New Password<br/>(8+ chars)<br/>required"]:::black -->
    NewValidate{Password<br/>Strong?<br/>Uppercase,<br/>Lowercase,<br/>Number}:::gold -->
    NewValidate -->|No| NewErr["❌ Show:<br/>Min 8 chars<br/>Requirements"]:::error -->
    NewPW
    NewValidate -->|Yes| NewOK["✓ Strong<br/>Password"]:::gold -->
    
    ConfirmPW["Confirm<br/>New Password<br/>required"]:::black -->
    ConfirmValidate{Matches<br/>New<br/>Password?}:::gold -->
    ConfirmValidate -->|No| ConfirmErr["❌ Passwords<br/>Do Not Match"]:::error -->
    ConfirmPW
    ConfirmValidate -->|Yes| ConfirmOK["✓ Passwords<br/>Match"]:::gold -->
    
    CurrentOK --> ReadyCheck{Save<br/>Password?}:::gold -->
    NewOK --> ReadyCheck
    ConfirmOK --> ReadyCheck
    
    ReadyCheck -->|No| DiscardPW[Discard<br/>Changes]:::error --> CancelPW([Cancelled]):::error
    
    ReadyCheck -->|Yes| PreparePayload[Prepare Update<br/>Payload]:::gold -->
    PayloadData["{<br/>currentPassword,<br/>newPassword<br/>}"]:::black -->
    
    PayloadData --> SendServer[Send POST<br/>/api/profile/<br/>change-password]:::gold -->
    
    ServerValidate[Server Validates<br/>Current Password<br/>Against Hash]:::black -->
    ServerCheck{Current<br/>Password<br/>Correct?}:::gold -->
    
    ServerCheck -->|No| CurrentWrong["❌ Return:<br/>Current Password<br/>Invalid"]:::error -->
    ShowCurrentErr[Display Error]:::error -->
    CurrentPW
    
    ServerCheck -->|Yes| CheckSame{New Password<br/>Same as<br/>Current?}:::gold -->
    CheckSame -->|Yes| SameErr["❌ Return:<br/>New Must Be<br/>Different"]:::error -->
    ShowSameErr[Display Error]:::error -->
    NewPW
    
    CheckSame -->|No| HashNew[Hash New<br/>Password<br/>bcrypt 10 rounds]:::black -->
    UpdateDB[Update Password<br/>Hash in Database]:::gold -->
    ReturnSuccess[Return Success<br/>Response]:::gold -->
    ClientSuccess[Client Receives<br/>Success]:::black -->
    ShowPWSuccess["✓ Show Success<br/>Message"]:::gold -->
    ClearFields[Clear All<br/>Password Fields]:::black -->
    SessionNote["Note: Current<br/>Session Remains<br/>Valid"]:::gold -->
    DonePW([Password<br/>Changed]):::gold
    
    classDef gold fill:#D4AF37,stroke:#000,stroke-width:2px,color:#000
    classDef black fill:#1a1a1a,stroke:#D4AF37,stroke-width:2px,color:#D4AF37
    classDef error fill:#cc0000,stroke:#000,stroke-width:2px,color:#fff
```

---

## 🏠 Address Edit Flow

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#D4AF37','primaryTextColor':'#000','primaryBorderColor':'#000','lineColor':'#D4AF37','secondaryColor':'#1a1a1a','tertiaryColor':'#333'}}}%%
graph TD
    Start([Edit Address]):::gold -->
    
    StreetField["Street Address<br/>(max 100 chars)<br/>required"]:::black -->
    StreetVal{Valid<br/>Street?}:::gold -->
    StreetVal -->|No| StreetErr["❌ Required<br/>Max 100 chars"]:::error -->
    StreetField
    StreetVal -->|Yes| StreetOK["✓ Street<br/>Valid"]:::gold -->
    
    ApartmentField["Apartment/Unit<br/>(max 50 chars)<br/>optional"]:::black -->
    ApartmentOK["✓ Recorded<br/>or Empty"]:::gold -->
    
    CityField["City<br/>(max 50 chars)<br/>required"]:::black -->
    CityVal{Valid<br/>City?}:::gold -->
    CityVal -->|No| CityErr["❌ Required<br/>Max 50 chars"]:::error -->
    CityField
    CityVal -->|Yes| CityOK["✓ City<br/>Valid"]:::gold -->
    
    StateField["State<br/>(dropdown)<br/>required"]:::black -->
    StateOK["✓ State<br/>Selected"]:::gold -->
    
    ZipField["Zip Code<br/>(5 digits)<br/>required"]:::black -->
    ZipVal{Valid<br/>Zip<br/>5 digits?}:::gold -->
    ZipVal -->|No| ZipErr["❌ Format:<br/>12345<br/>5 Digits Only"]:::error -->
    ZipField
    ZipVal -->|Yes| ZipOK["✓ Zip<br/>Valid"]:::gold -->
    
    CountryField["Country<br/>Display Only<br/>USA"]:::black -->
    CountryOK["✓ USA<br/>Set"]:::gold -->
    
    StreetOK --> SaveCheck{Save<br/>Address?}:::gold -->
    ApartmentOK --> SaveCheck
    CityOK --> SaveCheck
    StateOK --> SaveCheck
    ZipOK --> SaveCheck
    CountryOK --> SaveCheck
    
    SaveCheck -->|No| DiscardAddr[Discard<br/>Changes]:::error --> CancelAddr([Cancelled]):::error
    
    SaveCheck -->|Yes| SubmitAddr[Submit Address<br/>Update]:::gold -->
    ServerValidate[Server Validates<br/>Address Fields]:::black -->
    ServerOK{Validation<br/>Pass?}:::gold -->
    
    ServerOK -->|No| ServerErr[Return Error<br/>Details]:::error --> ShowErr[Display Error]:::error --> StreetField
    ServerOK -->|Yes| UpdateAddr[Update Address<br/>in Database]:::black -->
    ReturnAddr[Return Updated<br/>Profile Object]:::gold -->
    UpdateAuth[Update AuthContext<br/>& LocalStorage]:::black -->
    ShowAddrSuccess["✓ Show Success<br/>Message"]:::gold -->
    DoneAddr([Address<br/>Updated]):::gold
    
    classDef gold fill:#D4AF37,stroke:#000,stroke-width:2px,color:#000
    classDef black fill:#1a1a1a,stroke:#D4AF37,stroke-width:2px,color:#D4AF37
    classDef error fill:#cc0000,stroke:#000,stroke-width:2px,color:#fff
```

---

## 📱 Profile Form Components

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#D4AF37','primaryTextColor':'#000','primaryBorderColor':'#000','lineColor':'#D4AF37','secondaryColor':'#1a1a1a','tertiaryColor':'#333'}}}%%
graph TB
    ProfilePage["<b>ProfilePage</b><br/>Route: /profile<br/>Protected: Yes"]:::gold
    
    ProfilePage -->|renders| Section1["Section 1:<br/>Personal Details<br/>firstName, lastName,<br/>email, nickname"]:::black
    
    ProfilePage -->|renders| Section2["Section 2:<br/>Avatar<br/>Upload, Delete,<br/>Display"]:::black
    
    ProfilePage -->|renders| Section3["Section 3:<br/>Address<br/>street, apartment,<br/>city, state, zip"]:::black
    
    ProfilePage -->|renders| Section4["Section 4:<br/>Password<br/>currentPassword,<br/>newPassword"]:::black
    
    ProfilePage -->|renders| Section5["Section 5:<br/>Account Info<br/>Member Since,<br/>Status, Email Verified"]:::black
    
    ProfilePage -->|uses| AuthContext["AuthContext<br/>Provides: user,<br/>setUser(), logout()"]:::gold
    
    ProfilePage -->|makes API calls| API["Profile API<br/>GET /api/profile<br/>PATCH /api/profile<br/>POST /api/profile/password<br/>DELETE /api/profile/avatar"]:::black
    
    classDef gold fill:#D4AF37,stroke:#000,stroke-width:2px,color:#000
    classDef black fill:#1a1a1a,stroke:#D4AF37,stroke-width:2px,color:#D4AF37
```

---

## 🔑 Key Decision Points

| Decision Point | Yes Path | No Path |
|---|---|---|
| **User Logged In?** | Fetch profile data | Redirect to login |
| **Viewing Own Profile?** | Edit mode enabled | View-only mode |
| **Valid Email Format?** | Check uniqueness | Show format error |
| **Email Unique?** | Allow save | Show "taken" error |
| **Password Strong?** | Allow next step | Show requirements |
| **Passwords Match?** | Save password | Show mismatch error |
| **Valid Image Type?** | Check file size | Show type error |
| **File Size ≤ 5MB?** | Create preview | Show size error |
| **Current Password Correct?** | Update password | Show invalid error |
| **New Password Different?** | Update | Show same password error |

---

## 🔗 Related Documentation

- **[Profile Management Flow](./profile-management-flow.md)** - Sequential processes
- **[Authentication Flow Chart](./authentication-flow-chart.md)** - Login/auth flows
- **[Authentication Quickstart](../quickstart/authentication.md)** - Implementation details
- **[Main Application Flow](./main-application-flow.md)** - Overall navigation

---

**Chart Version:** 1.0  
**Last Updated:** December 29, 2025  
**Status:** ✅ Complete