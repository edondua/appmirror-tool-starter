# AI Assistant Guide for AppMirror Tools

This document provides context for AI assistants working on AppMirror tools.

## What is This?

This is a **tool** that runs inside AppMirror via Module Federation. It's a separate application that:
- Gets loaded into AppMirror at runtime
- Receives authentication and context from AppMirror
- Uses shared UI components from `@appmirror/ui-kit`

## Key Concepts

### Module Federation

This tool is a "remote" that gets loaded by AppMirror (the "host"):

```
AppMirror (Host)
    │
    │ Loads at runtime
    ▼
This Tool (Remote)
    │
    │ Uses
    ▼
@appmirror/ui-kit (Shared components)
```

### Shared Modules (CRITICAL)

The following must be configured as singletons in `vite.config.ts`:

```typescript
shared: {
  react: { singleton: true, requiredVersion: '^19.0.0' },
  'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
  '@tanstack/react-query': { singleton: true },
  '@appmirror/ui-kit': { singleton: true },
}
```

This ensures:
- React context works across module boundaries
- Dialogs, popovers, and tabs function correctly
- No "Cannot read properties of null (reading 'useContext')" errors

### Context Provider

Tools receive everything from AppMirror via `useToolContext()`:

```tsx
const {
  projectId,      // Which project is selected
  projectName,    // Project display name
  projectConfig,  // Tool-specific settings from project
  userId,         // Logged-in user
  userEmail,      // User's email
  canEdit,        // Edit permission
  canAdmin,       // Admin permission
  api,            // Pre-authenticated API client
  showToast,      // Notification function (USE THIS, not alert()!)
  navigate,       // Navigation function
} = useToolContext();
```

## File Structure

```
src/
├── Tool.tsx      # Main exported component (this is what AppMirror loads)
└── main.tsx      # Optional: for standalone dev testing
```

## Important Rules

### DO

- Use `@appmirror/ui-kit` for all UI components
- Use `useToolContext()` for auth, API, and project info
- Use `api.get()`, `api.post()` etc. for backend calls
- Use `showToast()` for all notifications
- Handle loading and error states
- Check `canEdit` before allowing modifications
- Use `"latest"` for ui-kit version in package.json

### DON'T

- Import React separately (it's shared from host)
- Create custom UI components (use ui-kit)
- Store auth tokens (host handles auth)
- Make direct fetch/axios calls (use provided `api`)
- Access localStorage for user data
- Use `alert()` - use `showToast()` instead!
- Forget to add `@tanstack/react-query` to shared modules

## Button Variants

```tsx
// VALID
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="mono">Monochrome</Button>

// INVALID - these don't exist
<Button variant="default">  // Use "primary"
<Button variant="link">     // Use "ghost"
```

## Button Sizes

```tsx
// VALID
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>

// INVALID
<Button size="default">  // Use "md"
```

## Common Patterns

### API Call

```tsx
const { api, projectId, showToast } = useToolContext();

const fetchData = async () => {
  try {
    const data = await api.get(`/api/items?projectId=${projectId}`);
    return data;
  } catch (error) {
    showToast('Failed to load data', 'error');
  }
};
```

### Form with Permission Check

```tsx
const { canEdit, showToast } = useToolContext();

const handleSubmit = async () => {
  if (!canEdit) {
    showToast('You do not have permission to edit', 'error');
    return;
  }
  // proceed with save
};

return (
  <Button disabled={!canEdit} onClick={handleSubmit}>
    Save
  </Button>
);
```

### Using Dialogs

```tsx
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, Button } from '@appmirror/ui-kit';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
    <p>Content...</p>
  </DialogContent>
</Dialog>
```

## Building & Testing

```bash
npm run dev      # Development server (port 5174)
npm run build    # Production build
npm run preview  # Preview production build
```

## Deployment

### Railway (Recommended)
1. Push to GitHub
2. Connect to Railway
3. Railway auto-detects Vite
4. Get URL: `https://mytool.up.railway.app/assets/remoteEntry.js`

### Vercel
1. Push to GitHub
2. Connect to Vercel
3. Build command: `npm run build`
4. Output: `dist`
5. Get URL: `https://mytool.vercel.app/assets/remoteEntry.js`

### Register in AppMirror
Go to Admin Settings → Tools tab and add your tool with the remote URL.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot read properties of null (reading 'useContext')" | Add all shared modules to vite.config.ts |
| "No QueryClient set" | Add `@tanstack/react-query` to shared modules |
| Dialogs show overlay but no content | Update ui-kit: `npm update @appmirror/ui-kit` |
| Tabs not showing active state | Update ui-kit: `npm update @appmirror/ui-kit` |
