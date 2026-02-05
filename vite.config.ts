import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import federation from '@originjs/vite-plugin-federation';

// IMPORTANT: Change 'mytool' to your tool's unique name
const TOOL_NAME = 'mytool';

export default defineConfig({
  plugins: [
    react(),
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
    cssCodeSplit: false,
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
