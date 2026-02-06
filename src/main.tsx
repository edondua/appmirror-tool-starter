/**
 * Entry point for standalone tool preview/development
 * This file is only used when running `npm run dev` independently.
 * In Module Federation, Tool.tsx is loaded directly by the host app.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Tool from './Tool';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Tool />
  </StrictMode>
);
