import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import { federation } from '@module-federation/vite';

// IMPORTANT: Change 'mytool' to your tool's unique name
const TOOL_NAME = 'mytool';
const toolRootSelector = '[data-tool-root="newtool"]';

function createScopedCssPlugin(scopeSelector: string) {
  return {
    postcssPlugin: 'scope-tool-css',
    Rule(rule: { selectors?: string[]; parent?: { type?: string; name?: string } }) {
      if (!rule.selectors) {
        return;
      }

      const parentName = rule.parent?.name ?? '';
      if (rule.parent?.type === 'atrule' && /keyframes$/i.test(parentName)) {
        return;
      }

      rule.selectors = rule.selectors.map((selector) => {
        const trimmed = selector.trim();
        if (!trimmed) {
          return selector;
        }
        if (trimmed.startsWith(scopeSelector)) {
          return trimmed;
        }
        if (
          trimmed === ':root' ||
          trimmed === ':host' ||
          trimmed === 'html' ||
          trimmed === 'body'
        ) {
          return scopeSelector;
        }
        if (trimmed.startsWith('::')) {
          return scopeSelector;
        }
        return `${scopeSelector} ${trimmed}`;
      });
    },
  };
}
const scopedCssPlugin = createScopedCssPlugin(toolRootSelector);

export default defineConfig({
  css: {
    postcss: {
      plugins: [scopedCssPlugin],
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: TOOL_NAME,
      filename: 'remoteEntry.js',
      exposes: {
        './Tool': './src/Tool.tsx',
      },
      shared: {
        // CRITICAL: All these must be singletons to share React context
        // This prevents "Cannot read properties of null (reading 'useContext')" errors
        react: { singleton: true, requiredVersion: '^19.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
        // Required for React Query context to work across module boundaries
        '@tanstack/react-query': { singleton: true },
        // Required for useToolContext and all UI components to work
        '@appmirror/ui-kit': { singleton: true },
      },
    }),
  ],
  build: {
    target: 'esnext',
    minify: true,
    cssCodeSplit: true,
  },
  server: {
    port: 5174,
    cors: true,
  },
  preview: {
    port: 4174,
    cors: true,
  },
});
