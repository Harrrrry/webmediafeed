# ShaadiCircle — Phase 2: Shaadi Admin & Guest Wedding Flow Implementation Plan

This document details the implementation plan for **Phase 2** of ShaadiCircle: the Shaadi Admin & Guest Wedding Flow. It covers all features from user registration, wedding creation to guest onboarding, admin approval, multi-marriage membership, and role-based access, as outlined in project.md.

---

## 📋 Feature Summary (Phase 2)

| Step | Feature                                 | Description                                      |
|------|-----------------------------------------|--------------------------------------------------|
| 0    | User Registration (Non-Guest)           | Register with username, email, password, etc.     |
| 1    | Shaadi Creation                         | Any registered user can create a wedding event; creator becomes admin (role: 'creater') |
| 2    | Invitation Generation                   | Show/share shaadi code and invite link            |
| 3    | Guest Join Request                      | Guests request to join shaadi via form            |
| 4    | Admin Approval Panel                    | Admin reviews, approves/declines guest requests   |
| 5    | Guest Home Screen                       | Approved guests see shaadi home, events, feed     |
| 6    | Multi-Marriage Membership & Switcher    | Users can join multiple shaadis and switch context; all content/actions are scoped to the selected shaadi |
| 7    | Role-based Access Control               | Permissions for admins/guests per shaadi          |
| 8    | Member Blocking                         | Creator can block/unblock any member              |
| 9    | Dual Login Flows                        | Separate login for registered users and for shaadi code access |
| 10   | Branding & Theme                        | Consistent Shaadi theme and festive UI            |

---

## 0. User Registration (Non-Guest)
- Registration is required for users who want to create/manage shaadis.
- **Fields:**
  - Username (required)
  - Email (required, unique)
  - Password (required, min. strength)
  - Phone number (optional)
  - Profile picture (optional)
  - Full name (optional)
- Only registered users can create/manage shaadis.
- Guests can join via invite link and provide minimal info (see step 3).

## 1. Shaadi Creation
- Any registered (logged-in) user can create a new wedding (shaadi) event.
- Form fields:
  - Wedding Title
  - Wedding Date(s)
  - Bride Name
  - Groom Name
  - Upload Bride Photo
  - Upload Groom Photo
  - Upload Wedding Cover Image
- After submission:
  - Generate a unique 6-digit code for the creator (user+shaadi specific)
  - Store all data in backend (MongoDB, shaadis collection)
  - **The creator is automatically added to the ShaadiMember collection with role 'creater' and their code**

## 2. Invitation Generation
- After wedding creation, show the "Shaadi Invitation Page":
  - Display generated 6-digit Shaadi Code (user+shaadi specific for each invite)
  - Show Invite Link (e.g., `shaadicircle.app/join/abc123`)
  - Buttons: “Copy Link”, “Share via WhatsApp”
  - Page is admin-only

## 3. Guest Join Request
- Guests access the join link or app and see a join form:
  - Name (text input)
  - Relationship (e.g., cousin, friend, etc.)
  - Select side: [Bride | Groom] (radio buttons)
  - Contact number (optional, with hide checkbox)
- On submit:
  - Store request in backend (invite collection, status: "pending")
  - Link to shaadi and generate a unique 6-digit code for the guest (user+shaadi specific)

## 4. Admin Approval Panel
- Admin UI (in bottom nav for admins):
  - List all pending guest join requests for the shaadi
  - Show: Name, relationship, side, contact (if visible)
  - Approve ✅ or Decline ❌ single or multiple requests
  - On approval: add to ShaadiMember collection, grant access, assign code and role

## 5. Guest Home Screen
- After approval, guests see the Shaadi Home Screen:
  - Welcome message with bride/groom names
  - Current/upcoming event cards
  - Shaadi social feed (image/video posts from guests)
  - Show shaadi context (title bar or badge)

## 6. Multi-Marriage Membership & Shaadi Switcher
- **Users (guests or creators) can be members of multiple shaadis (weddings).**
- Memberships are tracked in the ShaadiMember collection (each document: shaadiId, userId, role, code, blocked status).
- The app provides a UI switcher (dropdown, modal, or sidebar) to select the active shaadi.
- **The current shaadi context is always shown in the center of the app header.**
  - Clicking the shaadi name opens a dropdown/modal listing all joined shaadis and an option to create a new one.
- **All content, actions, and visibility are always scoped to the currently selected shaadi:**
  - Feed, posts, comments, events, guests, etc. are only for the active shaadi.
  - When the user switches to another shaadi, they see only that shaadi’s content and can post/interact only within that context.
  - Any post, comment, or action is always associated with the currently selected shaadi.
- **No cross-marriage data leakage:**
  - A user’s activity in one shaadi is not visible in another shaadi.
  - The user can only see and interact with the shaadis they have joined/been approved for.
- Applies to both guests and creators.
- **Switching Shaadi:**
  - When switching, user must enter their 6-digit code for the selected shaadi. Backend verifies code and membership in ShaadiMember collection.

---

### TODO: Multi-Marriage Membership & Shaadi Switcher Implementation
1. **Backend:**
   - [x] Implement ShaadiMember collection (shaadiId, userId, role, code, blocked status).
   - [x] Ensure all queries for posts, events, guests, etc. are filtered by shaadiId.
   - [x] All create/update actions require a shaadiId context.
   - [x] Add endpoints for switching shaadi (with code verification) and for blocking/unblocking members.
2. **Frontend:**
   - [x] Add a Shaadi Switcher UI in the center of the app header.
   - [x] Display the current shaadi's name; clicking opens a dropdown/modal with all joined shaadis and a "Create New Shaadi" option.
   - [x] On switch, prompt for 6-digit code, verify, and reload all data (feed, events, guests, etc.) for the selected shaadi.
   - [x] Ensure all actions (posting, commenting, etc.) are always tied to the active shaadi.
   - [x] Make the current shaadi context visible at all times.
   - [ ] Optionally, remember the last selected shaadi for the user.
3. **UX:**
   - [x] Prevent actions if no shaadi is selected.
   - [x] Show a clear indicator of the current shaadi context in the header.
   - [ ] Test on mobile and desktop for usability.

## 7. Role-based Access Control
- Enforce permissions throughout the app:
  - Creators: create events, manage guests, pin announcements, block/unblock members
  - Guests: post, comment, view events, browse contacts
  - Store `role: creater` or `guest` per user per shaadi in ShaadiMember collection

## 8. Member Blocking
- The creator ('creater' role) can block or unblock any member in their shaadi.
- Blocked members lose access to the shaadi and are notified.
- The blocked status is stored in the ShaadiMember collection.

## 9. Dual Login Flows
- **A. Login as Registered User**
  - Standard login (email/phone + password).
  - After login, user can create/manage their own Shaadi, or see all Shaadis they are a member of (with role-based features).
- **B. Login to Shaadi (with 6-digit code)**
  - Enter the 6-digit code (user+shaadi specific).
  - After login, user is taken directly to the relevant Shaadi as a member/guest, with only the features allowed for their role.
- The login page presents both options clearly.
- Always show a banner or indicator of the current mode (Registered User vs. Shaadi Member).

## 10. Branding & Theme
- Consistent Shaadi theme:
  - Pastel pink (#FADADD), peacock blue (#1F3A93), saffron (#FF9933)
  - Light traditional Indian patterns (SVG, blur overlays)
  - Festive fonts ("Poppins" for text, "Yatra One" for headers)

---

> Use this plan as a step-by-step implementation guide for Phase 2 of ShaadiCircle. Each feature can be developed and tested independently, then integrated for a seamless wedding onboarding and management experience.

---

## Guest Invitation & Join Flow (Per Shaadi)

### Checklist
- [x] **Design join form page to match registration page** (consistent UI/UX, fields, and validation)
- [x] **Implement join form** (collect name, side, relationship, contact number with privacy toggle; connected to backend API, handles errors/success)
- [x] **Auto-fill code from join link** (`/join?code=123456`)
- [x] **Membership check:** Join page checks membership on mount and redirects to Shaadi home/feed if already a member
- [x] **Add beautiful, joyful welcome page** (festive gradient background, animated sparkles, floating couple avatar, pulsing welcome button, gradient text effects)
- [x] **Show welcome page after first join only** (event name, date, couple photo, "Shaadi me Swagat Hai 💖" button with animations)
- [x] **Redirect to Shaadi home/feed after welcome page** (navigate to home page when welcome button is clicked)
- [x] **Support joining multiple Shaadis** (ShaadiSwitcher already fully implemented with multi-Shaadi support)
- [x] **Allow switching between Shaadis via switcher menu** (ShaadiSwitcher provides complete switching functionality with code verification)

### 1. Admin Shares Invitation
- Admin shares:
  - 📸 Invitation card image
  - 🔗 Join link: `https://shaadicircle.app/join?code=123456`
  - 🔢 Shaadi Code: `123456` (for manual entry)
- Each invite is unique to a single Shaadi.

### 2. Guest Clicks Join Link or Enters Code
- Guest opens the join link or enters the code in the app.
- The app auto-fills the code if opened from a link.

### 3. Membership Check (Critical Step)
- **The app checks if the guest (user) is already a member of this Shaadi:**
  - If **already a member**:
    - **Skip** the join form and welcome page.
    - **Redirect directly** to the Shaadi's home/feed page.
  - If **not a member**:
    - **Show** the join form (see checklist above for design/fields).
    - **After submit:**
      - Add guest as a member of the Shaadi.
      - Show the **beautiful, joyful welcome page** (see checklist above for requirements).
      - On tap, redirect to Shaadi home/feed.

### 4. Multiple Shaadis & Repeat Joins
- This logic applies **per Shaadi**:
  - If a guest receives a new invite for a different Shaadi, the join form and welcome page are shown for that event.
  - If a guest clicks a join link for a Shaadi they've already joined, the app skips the form/welcome and goes straight to the event.
- Guests can join and switch between multiple Shaadis using the switcher menu.

### 5. Summary Table
| Scenario                                 | Join Form? | Welcome Page? | Redirected To         | Switcher Updated? |
|-------------------------------------------|------------|---------------|-----------------------|-------------------|
| First-time join (any Shaadi)              | Yes        | Yes           | Shaadi home/feed      | Yes               |
| Click same invite again (already joined)  | No         | No            | Shaadi home/feed      | No change         |
| Join second Shaadi (already in one)       | Yes        | Yes           | Second Shaadi home    | Yes (now 2)       |

### 6. Key Points
- **Every Shaadi invite is independent.**
- **Membership is per Shaadi.**
- **If already joined:** The join form and welcome page are skipped.
- **Multiple Shaadis:** Guests can join multiple events and switch between them.
- **This logic ensures a smooth, user-friendly experience for both first-time and returning guests.**

### 7. Welcome Page Features
- **Festive Design:** Pink gradient background with animated sparkles
- **Animations:** Floating couple avatar, pulsing welcome button, fade-in card
- **Content:** Event name, date, couple photo/initials, welcome message
- **Interactive:** "Shaadi me Swagat Hai 💖" button with hover effects
- **Responsive:** Mobile-friendly design with proper spacing

