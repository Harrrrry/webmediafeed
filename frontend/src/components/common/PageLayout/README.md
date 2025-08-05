# PageLayout Component

A flexible layout wrapper that controls the visibility of header and bottom navigation across pages.

## Usage

```tsx
import PageLayout from '../components/common/PageLayout';

// Default usage (shows both header and bottom nav)
<PageLayout>
  <YourPageContent />
</PageLayout>

// Hide header only
<PageLayout showHeader={false}>
  <YourPageContent />
</PageLayout>

// Hide bottom navigation only
<PageLayout showBottomNav={false}>
  <YourPageContent />
</PageLayout>

// Hide both header and bottom navigation
<PageLayout showHeader={false} showBottomNav={false}>
  <YourPageContent />
</PageLayout>
```

## Props

- `children`: React.ReactNode - The page content
- `showHeader?: boolean` - Whether to show the AppHeader (default: true)
- `showBottomNav?: boolean` - Whether to show the BottomNav (default: true)
- `className?: string` - Additional CSS classes

## Examples

### JoinShaadi Page (No header, no bottom nav)
```tsx
<PageLayout showHeader={false} showBottomNav={false}>
  <JoinShaadiContent />
</PageLayout>
```

### Login Page (No bottom nav)
```tsx
<PageLayout showBottomNav={false}>
  <LoginContent />
</PageLayout>
```

### Regular Page (Both header and nav)
```tsx
<PageLayout>
  <RegularPageContent />
</PageLayout>
```

## Benefits

1. **Consistent Layout**: All pages use the same layout structure
2. **Flexible Control**: Easy to show/hide header and navigation
3. **Maintainable**: Centralized layout logic
4. **Reusable**: Can be used across all pages
5. **Type Safe**: Full TypeScript support 