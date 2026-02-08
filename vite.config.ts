import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import { federation } from '@module-federation/vite';
import { fileURLToPath } from 'url';

// IMPORTANT: Change 'mytool' to your tool's unique name
const TOOL_NAME = 'mytool';

const mfVirtualDir = fileURLToPath(
  new URL('./node_modules/__mf__virtual', import.meta.url)
);

export default defineConfig({
  css: {
    modules: {
      // Enable CSS Modules with scoped class names
      generateScopedName: '[name]__[local]___[hash:base64:5]',
    },
  },
  resolve: {
    alias: {
      __mf__virtual: mfVirtualDir,
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
        react: {
          singleton: true,
          requiredVersion: '^19.0.0',
          strictVersion: false,
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^19.0.0',
          strictVersion: false,
        },
        // Required for React Query context to work across module boundaries
        '@tanstack/react-query': {
          singleton: true,
          strictVersion: false,
        },
        // Required for useToolContext and all UI components to work
        '@appmirror/ui-kit': {
          singleton: true,
          strictVersion: false,
        },
      },
    }),
  ],
  build: {
    target: 'esnext',
    minify: true,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        minifyInternalExports: false,
      },
    },
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
