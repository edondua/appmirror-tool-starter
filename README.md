# AppMirror Tool Starter

A starter template for building tools that integrate with AppMirror via Module Federation.

## Quick Start

```bash
# 1. Clone this template
git clone https://github.com/edondua/appmirror-tool-starter my-tool
cd my-tool

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

## Configuration

### 1. Set Your Tool Name

Edit `vite.config.ts` and change `TOOL_NAME`:

```typescript
const TOOL_NAME = 'mytool';  // Change to your tool's unique name
```

### 2. Build Your Tool

Edit `src/Tool.tsx` - this is your main component that AppMirror loads.

## Available Context

Your tool receives context from AppMirror via `useToolContext()`:

```tsx
import { useToolContext } from '@appmirror/ui-kit';

function MyTool() {
  const {
    // Project info
    projectId,        // Current project ID
    projectName,      // Current project name
    projectConfig,    // Tool-specific settings from project

    // User info
    userId,           // Logged-in user's ID
    userEmail,        // Logged-in user's email

    // Permissions
    canEdit,          // Can edit this tool's data
    canAdmin,         // Has admin access

    // API (pre-authenticated)
    api,              // { get, post, put, patch, delete }

    // Utilities
    showToast,        // (message, type) => void  - USE THIS instead of alert()!
    navigate,         // (path) => void
  } = useToolContext();
}
```

## UI Components

Use components from `@appmirror/ui-kit`:

```tsx
import {
  Button,
  Card, CardHeader, CardTitle, CardContent,
  Input,
  Label,
  Badge,
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle,
  AlertDialog, AlertDialogTrigger, AlertDialogContent,
  Tabs, TabsList, TabsTrigger, TabsContent,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
  // ... and many more
} from '@appmirror/ui-kit';
```

### Button Variants
- `primary` - Main actions (orange brand color)
- `secondary` - Secondary actions
- `destructive` - Dangerous actions (red)
- `outline` - Outlined style
- `ghost` - Minimal style
- `mono` - Monochrome

### Button Sizes
- `sm` - Small
- `md` - Medium (default)
- `lg` - Large
- `icon` - Icon only

## Deployment

### Deploy to Railway (Recommended)

1. Push your repo to GitHub
2. Connect to Railway (railway.app)
3. Railway auto-detects Vite and builds correctly
4. Note your deployment URL (e.g., `mytool.up.railway.app`)
5. Remote entry: `https://mytool.up.railway.app/assets/remoteEntry.js`

### Deploy to Vercel

1. Push your repo to GitHub
2. Connect to Vercel (vercel.com)
3. Build command: `npm run build`
4. Output directory: `dist`
5. Remote entry: `https://mytool.vercel.app/assets/remoteEntry.js`

### Register in AppMirror

Go to **Admin Settings → Tools tab** in AppMirror and add:
- **Tool ID:** `mytool` (your unique identifier from vite.config.ts)
- **Tool Name:** `My Tool` (display name)
- **Icon:** `wrench` (any KeenIcon name)
- **Remote URL:** `https://mytool.up.railway.app/assets/remoteEntry.js`

## Development Tips

### Local Testing with AppMirror

1. Run your tool: `npm run dev` (runs on port 5174)
2. In AppMirror Admin Settings → Tools, add your tool with URL: `http://localhost:5174/assets/remoteEntry.js`
3. Run AppMirror: `npm run dev`

### API Calls

Always use the provided `api` object - it's pre-authenticated:

```tsx
const { api, projectId } = useToolContext();

// GET request
const data = await api.get(`/api/items?projectId=${projectId}`);

// POST request
await api.post('/api/items', { name: 'New Item', projectId });
```

### Showing Notifications

**NEVER use `alert()`** - use `showToast()` instead:

```tsx
const { showToast } = useToolContext();

showToast('Success!', 'success');
showToast('Something went wrong', 'error');
showToast('FYI...', 'info');
```

### Using Dialogs

```tsx
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, Button } from '@appmirror/ui-kit';

function MyComponent() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
        </DialogHeader>
        <p>Dialog content here...</p>
      </DialogContent>
    </Dialog>
  );
}
```

## File Structure

```
my-tool/
├── src/
│   ├── Tool.tsx          # Main component (exposed via Module Federation)
│   └── main.tsx          # Optional: for standalone dev testing
├── vite.config.ts        # Vite + Module Federation config
├── package.json
├── tsconfig.json
└── README.md
```

## Troubleshooting

### "Cannot read properties of null (reading 'useContext')"

Your tool is using a different React instance. Make sure `vite.config.ts` has:
```typescript
shared: {
  react: { singleton: true, requiredVersion: '^19.0.0' },
  'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
  '@tanstack/react-query': { singleton: true },
  '@appmirror/ui-kit': { singleton: true },
}
```

### "No QueryClient set"

Add `@tanstack/react-query` to your shared modules (see above).

### Dialogs show overlay but no content

Update to latest ui-kit: `npm update @appmirror/ui-kit`

### Tabs not showing active state

Update to latest ui-kit: `npm update @appmirror/ui-kit`

## Auto-Updates

This template uses `"latest"` for `@appmirror/ui-kit`, which means:
- Every deploy automatically gets the newest ui-kit version
- No manual updates needed
- Railway/Vercel run `npm install` on each deploy

## Need Help?

- Check `docs/TOOL_DEVELOPMENT.md` in the AppMirror repo
- Review TTSlide as a reference implementation (`github.com/edondua/ttPost`)
