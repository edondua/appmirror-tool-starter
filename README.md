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
    showToast,        // (message, type) => void
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
  Dialog, DialogTrigger, DialogContent,
  // ... and many more
} from '@appmirror/ui-kit';
```

### Button Variants
- `primary` - Main actions
- `secondary` - Secondary actions
- `destructive` - Dangerous actions
- `outline` - Outlined style
- `ghost` - Minimal style

### Button Sizes
- `sm` - Small
- `md` - Medium (default)
- `lg` - Large
- `icon` - Icon only

## Deployment

### Deploy to Vercel

1. Push your repo to GitHub
2. Connect to Vercel (vercel.com)
3. Build command: `npm run build`
4. Output directory: `dist`

### Register in AppMirror

After deploying, contact an AppMirror admin to add your tool:
- Tool Name: Your tool's display name
- Remote URL: `https://your-tool.vercel.app/assets/remoteEntry.js`

## Development Tips

### Local Testing with AppMirror

1. Run your tool: `npm run dev` (runs on port 5174)
2. Update AppMirror's tool registry to point to `http://localhost:5174/assets/remoteEntry.js`
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

```tsx
const { showToast } = useToolContext();

showToast('Success!', 'success');
showToast('Something went wrong', 'error');
showToast('FYI...', 'info');
```

## File Structure

```
my-tool/
├── src/
│   └── Tool.tsx          # Main component (exposed via Module Federation)
├── vite.config.ts        # Vite + Module Federation config
├── package.json
├── tsconfig.json
└── README.md
```

## Need Help?

- Check `docs/TOOL_DEVELOPMENT.md` in the AppMirror repo
- Review TTSlide as a reference implementation
