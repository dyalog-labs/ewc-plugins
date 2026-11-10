import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const here = (p) => fileURLToPath(new URL(p, import.meta.url));

// Library build: one ES module that the EWC client import()s at runtime.
//
// - Everything React-shaped resolves to the client's own instance, so the
//   bundle carries no second copy (two copies would break hooks). Unlike Kendo,
//   MUI also imports react/jsx-runtime and react-dom; see the shims for each.
// - The aliases are anchored regexes: a plain 'react' key would also prefix
//   match react/jsx-runtime and resolve it to a path inside the shim.
// - Output goes to ../assets, which Register mounts as /mui/.
export default defineConfig({
  plugins: [react()],
  // React-adjacent code reads process.env.NODE_ENV. A library build does not
  // substitute it, so the bundle would throw "process is not defined".
  define: { 'process.env.NODE_ENV': '"production"' },
  resolve: {
    alias: [
      { find: /^react$/, replacement: here('src/react-shim.js') },
      { find: /^react\/jsx(-dev)?-runtime$/, replacement: here('src/jsx-runtime-shim.js') },
      { find: /^react-dom$/, replacement: here('src/react-dom-shim.js') },
    ],
  },
  build: {
    outDir: here('../assets'),
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      entry: here('src/index.jsx'),
      formats: ['es'],
      fileName: () => 'ewc-mui.js',
    },
  },
});
