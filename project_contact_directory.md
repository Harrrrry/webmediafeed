# Contact Directory Module — ShaadiCircle App

## Overview
Implement a Contact Directory for each wedding event (Shaadi) in the ShaadiCircle app. This directory is accessible via the bottom navigation's "Contact" option and displays all approved guests, grouped by side, with privacy and moderation features.

---

## Features

### 1. **Auto-Populated List**
- Automatically lists all guests who have joined the selected wedding event (Shaadi).
- Only shows guests who are approved by the creator of shaadi ,..
- Data is scoped to the currently selected Shaadi.

### 2. **Group Guests by Side**
- Guests are visually and functionally separated into:
  - **Groom Side**
  - **Bride Side**
- Each group is clearly labeled and organized under its own section/tab.

### 3. **Profile Display**
For each guest, display:
- **Profile Picture** (or default avatar if not set)
- **Full Name**
- **Relationship** (e.g., Cousin, Friend)
- **Contact Number** (only if the guest has opted in to show it)
- **Call Icon** (opens dialer on mobile devices)

### 4. **Privacy Rules**
- Contact numbers are only visible if the guest has enabled visibility in their privacy settings.
- By default, contact numbers are hidden.
- All privacy settings must be respected in the UI and API.

### 5. **Search & Filter (Optional)**
- A search bar allows users to quickly find guests by name or relationship.
- Filtering by side (Bride/Groom) is supported via tabs or headings.

### 6. **Block / Report Functionality**
- Each guest card includes a 3-dot (⋮) menu with:
  - **Block this user**: Hides the guest from the contact list for the current user. (Cannot block self)
  - **Report this user**: Opens a modal with predefined reasons (e.g., spam, inappropriate behavior). Submits report to admin moderation (backend stub only).
- Blocked users are not shown in the contact list for the blocker.

### 7. **UI/UX Guidelines**
- Friendly, wedding-themed design (colors, icons, typography).
- Clear tabs or headings for "Bride Side" and "Groom Side".
- Consistent with overall ShaadiCircle app style.
- Show a message like "No contacts to display" if the list is empty.
- All actions (block/report) are confirmed with toasts or modals.

### 8. **Prevent Self-Block**
- Users cannot block themselves (option is hidden/disabled for self).

### 9. **Mobile Friendly**
- Fully responsive layout.
- Touch-friendly controls and large tap targets.
- Call icon opens the phone dialer on mobile devices.

### 10. **Extendability**
- Data model and UI are designed to support future features, such as guest tagging in posts.
- Modular component structure for easy extension.

---

## Data Model (Example)
```ts
interface Guest {
  id: string;
  fullName: string;
  profilePicUrl?: string;
  relationship: string;
  side: 'bride' | 'groom';
  contactNumber?: string;
  showContact: boolean;
  blockedBy: string[]; // user IDs who have blocked this guest
}
```

---

## API Endpoints (Suggested)
- `GET /shaadi/:shaadiId/guests` — List all approved guests for a Shaadi
- `POST /guests/:guestId/block` — Block a guest
- `POST /guests/:guestId/report` — Report a guest (with reason)

---

## UI Components
- **ContactDirectoryPage**: Main page, fetches and displays guests grouped by side.
- **GuestCard**: Shows profile, name, relationship, contact (if allowed), call icon, and 3-dot menu.
- **BlockReportMenu**: 3-dot menu for block/report actions.
- **ReportModal**: Modal for submitting a report with predefined reasons.
- **SearchBar**: (Optional) For searching/filtering guests.

---

## User Flows
1. **Access Directory**: User taps "Contact" in bottom nav → sees grouped guest list for current Shaadi.
2. **View Profile**: User sees guest info, contact if allowed, and can tap call icon (mobile).
3. **Block/Report**: User opens 3-dot menu, selects block or report, confirms action.
4. **Search**: User types in search bar to filter guests (optional).
5. **Empty State**: If no guests, show "No contacts to display" message.

---

## Edge Cases
- No guests: Show empty state message.
- All guests blocked: Show empty state message.
- User tries to block self: Option is hidden/disabled.
- Guest has not opted to show contact: Hide contact/call icon.

---

## Future Extensions
- Support guest tagging in posts/comments.
- Add admin moderation dashboard for reports.
- Allow guests to update privacy settings from their profile.

---

## Visual Example

```
Bride Side
----------
[Avatar] Priya Sharma (Cousin)   [Call] [⋮]
[Avatar] Anjali Patel (Sister)   [⋮]

Groom Side
----------
[Avatar] Rahul Kumar (Friend)    [Call] [⋮]

[Search Bar]

No contacts to display
```

---

## Notes
- All features must be mobile-first and accessible.
- Use MUI or styled-components for consistent theming.
- All actions should provide user feedback (toasts, modals, etc). 