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

## Tailwind 4 Configuration (IMPORTANT)

This template uses Tailwind CSS 4. The `src/index.css` file **must** include `@source` directives to scan the ui-kit:

```css
@import "tailwindcss";

/* REQUIRED: Scan ui-kit for component classes */
@source "../node_modules/@appmirror/ui-kit/dist/**/*.js";
@source "./**/*.{js,jsx,ts,tsx}";

/* Do NOT add :root variables - they'll override the host app's theme */
```

**Why this matters:**
- Without `@source` for ui-kit, tabs won't show active state, dialogs may not appear correctly
- Tailwind 4 only generates CSS for classes it finds in scanned files
- Never add `:root` CSS variables - the host app (AppMirror) provides all theme variables

## Deployment

### Deploy to Railway (Recommended)

1. Push your repo to GitHub
2. Connect to Railway (railway.app)
3. Configure Railway:
   - Build command: `npm run build`
   - Start command: `npm start` (uses server.js)
4. Note your deployment URL (e.g., `mytool.up.railway.app`)
5. Remote entry: `https://mytool.up.railway.app/remoteEntry.js`

**Why server.js?**
Railway needs an Express server to serve the built files with proper CORS headers required for Module Federation cross-origin loading.

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
- **Remote URL:** `https://mytool.up.railway.app/remoteEntry.js`

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
│   ├── main.tsx          # For standalone dev testing
│   └── index.css         # Tailwind 4 config with @source directives
├── index.html            # Entry for standalone dev
├── server.js             # Express server for Railway deployment
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

Check that `src/index.css` has the `@source` directive for ui-kit:
```css
@source "../node_modules/@appmirror/ui-kit/dist/**/*.js";
```

### Tabs not showing active state

Same as above - ensure `@source` directive includes ui-kit in `src/index.css`.

### Theme colors wrong / header changes color when tool loads

You may have `:root` CSS variables in your tool that override the host app. **Remove all `:root` variables from your CSS.**

### remoteEntry.js 404 on Railway

Make sure:
1. `server.js` exists and serves from `dist/assets`
2. `package.json` has `"start": "node server.js"`
3. Railway is configured to run `npm start`

## Auto-Updates

This template uses `"latest"` for `@appmirror/ui-kit`, which means:
- Every deploy automatically gets the newest ui-kit version
- No manual updates needed
- Railway/Vercel run `npm install` on each deploy

## Need Help?

- Check `docs/TOOL_DEVELOPMENT.md` in the AppMirror repo
- Review TTSlide as a reference implementation (`github.com/edondua/ttslide`)
