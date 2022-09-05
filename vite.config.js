import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import vue2 from '@vitejs/plugin-vue2';

// eslint-disable-next-line no-undef
// console.log(process.env);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue2(),
    legacy({
      targets: ['ie >= 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  /* base: import.meta.env.MODE === 'production' ? '/mosaico-virtual/' : '/', */
  // eslint-disable-next-line no-undef
  base: process.env.NODE_ENV === 'production' ? '/mosaico-virtual/' : '/',
});
