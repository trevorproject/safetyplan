import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

// Kept separate from vite.config.ts so the build's `tsc -b` never has to
// type-check Vitest's config against a second bundled copy of Vite.
export default mergeConfig(
  viteConfig,
  defineConfig({
    // Test files are excluded from tsconfig.app.json, so pin the JSX runtime
    // here instead of letting esbuild fall back to the classic one.
    esbuild: { jsx: 'automatic', jsxImportSource: 'react' },
    test: {
      // jsdom gives the components a DOM to render into; it does NOT apply CSS
      // or compute layout, so the responsiveness suite asserts on the
      // responsive Tailwind utilities each component declares (see
      // src/test/responsive.tsx).
      environment: 'jsdom',
      globals: true,
      css: false,
      setupFiles: ['./src/test/setup.ts'],
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
    },
  }),
);
