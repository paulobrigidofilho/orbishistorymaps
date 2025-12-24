# Profile Management Flow

This document describes how users view and edit their profiles, including avatar management.

---

## Flow Diagram

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#D4AF37','primaryTextColor':'#000','primaryBorderColor':'#000','lineColor':'#D4AF37','secondaryColor':'#1a1a1a','tertiaryColor':'#333'}}}%%
graph TD
    Start[Access Profile]:::gold --> Check{Is Own Profile?}:::gold
    
    Check -->|Yes| EditMode[Edit Mode]:::black
    Check -->|No| ViewMode[View Only Mode]:::black
    
    EditMode --> PersonalInfo[Edit Personal Info]:::gold
    EditMode --> AvatarMgmt[Avatar Management]:::gold
    EditMode --> AddressInfo[Edit Address]:::gold
    
    PersonalInfo --> FirstName[First Name]:::black
    PersonalInfo --> LastName[Last Name]:::black
    PersonalInfo --> Email[Email]:::black
    PersonalInfo --> Nickname[Nickname]:::black
    
    AvatarMgmt --> ViewCurrent[View Current Avatar]:::black
    AvatarMgmt --> UploadNew[Upload New Avatar]:::black
    AvatarMgmt --> DeleteAvatar[Delete Avatar]:::black
    
    UploadNew --> SelectFile[Select Image File]:::gold
    SelectFile --> ValidateFile{Valid?}:::gold
    ValidateFile -->|Yes| Preview[Show Preview]:::black
    ValidateFile -->|No| FileError[Show Error]:::error
    Preview --> ConfirmUpload[Confirm Upload]:::gold
    ConfirmUpload --> SaveAvatar[Save to Server]:::black
    
    DeleteAvatar --> ConfirmDelete[Confirm Deletion]:::gold
    ConfirmDelete --> RemoveFile[Remove from Server]:::black
    RemoveFile --> UpdateDB[Clear DB Path]:::black
    
    AddressInfo --> Street[Street Address]:::black
    AddressInfo --> City[City]:::black
    AddressInfo --> State[State]:::black
    AddressInfo --> Zip[Zip Code]:::black
    
    FirstName --> SaveChanges[Save Changes]:::gold
    LastName --> SaveChanges
    Email --> SaveChanges
    Nickname --> SaveChanges
    SaveAvatar --> SaveChanges
    UpdateDB --> SaveChanges
    Street --> SaveChanges
    City --> SaveChanges
    State --> SaveChanges
    Zip --> SaveChanges
    
    SaveChanges --> UpdateProfile[Update Profile]:::black
    UpdateProfile --> Success[Success Message]:::gold
    Success --> RefreshView[Refresh Profile View]:::black
    
    ViewMode --> DisplayInfo[Display Profile Info]:::gold
    DisplayInfo --> ReturnHome[Return Home Button]:::black
    
    classDef gold fill:#D4AF37,stroke:#000,stroke-width:2px,color:#000
    classDef black fill:#1a1a1a,stroke:#D4AF37,stroke-width:2px,color:#D4AF37
    classDef error fill:#cc0000,stroke:#000,stroke-width:2px,color:#fff
```

---

## Profile Sections

### Personal Details
- First Name (required)
- Last Name (required)
- Email (required, validated)
- Nickname (required)

### Avatar Management
- **Upload:** 5MB max, image files only (JPG, PNG, GIF)
- **Delete:** Removes file from server and clears DB reference
- **Preview:** Shows before confirming upload
- **Current:** Displays existing avatar or default

### Address Information
- Street Address
- Apartment/Unit (optional)
- City
- State/Region
- Zip/Postal Code

---

## Access Control

- **Own Profile:** Full edit access
- **Other Profiles:** View only (future feature)
- **Guest Users:** Redirect to login

---

**Related Documents:**
- [Authentication Flow](./authentication-flow.md)
- [Main Application Flow](./main-application-flow.md)
