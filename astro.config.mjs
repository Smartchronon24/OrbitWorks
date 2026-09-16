// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://smartchronon24.github.io',
  base: '/OrbitWorks/',
  vite: {
    server: {
      allowedHosts: true
    }
  }
});
