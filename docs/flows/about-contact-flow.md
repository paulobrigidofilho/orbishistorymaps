# About Us & Contact Flow

This document describes the planned About Us page featuring company information, team members, contact form, and location map.

**Status:** 🔄 Planned Feature

---

## Flow Diagram

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#D4AF37','primaryTextColor':'#000','primaryBorderColor':'#000','lineColor':'#D4AF37','secondaryColor':'#1a1a1a','tertiaryColor':'#333'}}}%%
graph TD
    About[About Us Page]:::gold --> Hero[Hero Section]:::black
    About --> Team[Team Section]:::black
    About --> Contact[Contact Section]:::gold
    About --> Location[Location Section]:::black
    
    Hero --> Mission[Project Mission]:::gold
    
    Team --> Members[Team Member Cards]:::gold
    Members --> Photo[Member Photo]:::black
    Members --> Role[Member Role]:::black
    Members --> Bio[Member Bio]:::black
    
    Contact --> Form[Contact Form]:::black
    Form --> FormFields[Name, Email, Subject, Message]:::gold
    FormFields --> Validate{Valid?}:::gold
    
    Validate -->|Yes| Submit[Submit Form]:::black
    Validate -->|No| ValidationErrors[Show Errors]:::error
    
    Submit --> SendEmail[Send Email]:::gold
    SendEmail --> EmailSuccess{Sent?}:::gold
    
    EmailSuccess -->|Yes| SuccessMsg[Success Message]:::gold
    EmailSuccess -->|No| ErrorMsg[Error Message]:::error
    
    SuccessMsg --> ClearForm[Clear Form]:::black
    
    Location --> GoogleMaps[Google Maps Embed]:::gold
    GoogleMaps --> Address[Business Address]:::black
    GoogleMaps --> MapControls[Zoom, Directions, Street View]:::black
    
    About --> Social[Social Media Links]:::gold
    
    classDef gold fill:#D4AF37,stroke:#000,stroke-width:2px,color:#000
    classDef black fill:#1a1a1a,stroke:#D4AF37,stroke-width:2px,color:#D4AF37
    classDef error fill:#cc0000,stroke:#000,stroke-width:2px,color:#fff
```

---

## Page Sections

### Hero Section
- Project mission statement
- Brand values
- Hero image/video

### Team Section
- Team member cards
- Photos and bios
- Roles and responsibilities
- Optional social media links

### Contact Form
- **Fields:** Name, Email, Subject, Message
- **Validation:** Required fields, email format
- **Submission:** Sends email to company inbox
- **Feedback:** Success/error messages

### Location Section
- Google Maps embed
- Business address
- Map controls (zoom, directions, street view)
- Optional directions link

### Social Media
- Links to company social profiles
- Icon-based navigation

---

## Contact Form Requirements

- All fields required except additional notes
- Email validation
- Message min/max length
- Anti-spam protection (future: CAPTCHA)
- Confirmation email to sender

---

**Related Documents:**
- [Main Application Flow](./main-application-flow.md)
