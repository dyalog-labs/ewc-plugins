import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const here = (p) => fileURLToPath(new URL(p, import.meta.url));

// Library build: one ES module that the EWC client import()s at runtime.
//
// - `react` is aliased to a shim re-exporting the client's own React, so the
//   bundle never carries a second copy. Two React instances would break hooks
//   in any plugin component that uses them.
// - The classic JSX runtime keeps that to a single alias; the automatic runtime
//   would need react/jsx-runtime shimmed as well.
// - Output goes to ../assets, which Register mounts as /apexcharts/. The built
//   files are gitignored - ApexCharts is licensed software this repository may
//   not redistribute - so building locally is a required setup step.
export default defineConfig({
  plugins: [react({ jsxRuntime: 'classic' })],
  // A library build does not substitute process.env.NODE_ENV, so the bundle
  // would throw "process is not defined" the moment it loaded in the browser.
  define: { 'process.env.NODE_ENV': '"production"' },
  resolve: {
    alias: { react: here('src/react-shim.js') },
  },
  build: {
    outDir: here('../assets'),
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      entry: here('src/index.jsx'),
      formats: ['es'],
      fileName: () => 'ewc-apexcharts.js',
    },
    rollupOptions: {
      output: { assetFileNames: 'ewc-apexcharts.[ext]' },
    },
  },
});
