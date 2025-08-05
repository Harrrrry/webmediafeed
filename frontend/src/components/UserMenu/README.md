# UserMenu Component

## Overview
The UserMenu component provides the main navigation header for the application, including the app name, Shaadi switcher, notifications, and user menu.

## Features

### Conditional Shaadi Switcher Display
The Shaadi switcher dropdown is only visible when the user is a member or creator of at least one Shaadi.

#### Behavior:
- **No Shaadis**: Shows "No Shaadi selected" text instead of the dropdown
- **Has Shaadis**: Shows the full Shaadi switcher with dropdown functionality

#### Implementation:
```typescript
// Check if user has any Shaadis (is member/creator of any)
const hasUserShaadis = userShaadis && userShaadis.length > 0;

// Conditional rendering
{hasUserShaadis ? (
  <ShaadiSwitcher />
) : (
  <Box display="flex" alignItems="center" gap={1}>
    <Typography variant="body2" sx={{ color: theme.colors.textSecondary }}>
      No Shaadi selected
    </Typography>
  </Box>
)}
```

### User States:
1. **New User**: No Shaadis → Header shows "No Shaadi selected"
2. **Member/Creator**: Has Shaadis → Header shows Shaadi switcher dropdown
3. **After Joining**: User joins a Shaadi → Dropdown becomes visible
4. **After Creating**: User creates a Shaadi → Dropdown becomes visible

This improves UX by not showing confusing empty dropdowns to users who haven't joined any Shaadis yet. 