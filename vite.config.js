import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The screen components are written with React.createElement (no JSX) and a few
// files (tweaks-panel) use real JSX. plugin-react handles both. We keep an
// explicit `import React from 'react'` in every module so the same files render
// server-side in the Figma export step.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, open: true },
});
