import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import markdoc from "@astrojs/markdoc";
import keystatic from "@keystatic/astro";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import solidJs from "@astrojs/solid-js";
// Use ` /** @jsxImportSource solid-js */ ` above solid-js jsx components
import AstroPWA from "@vite-pwa/astro";
import svelte from "@astrojs/svelte";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: "http://127.0.0.1:4321",
  vite: {
    define: {
      __DATE__: `'${new Date().toISOString()}'`
    }
  },
  integrations: [react(), markdoc(), keystatic(), tailwind({
    applyBaseStyles: false
  }), sitemap(), solidJs(), svelte(), AstroPWA({
    manifest: {
      theme_color: '#ffffff',
      icons: [{
        src: "/logo/pwa-64x64.png",
        sizes: "64x64",
        type: "image/png"
      }, {
        src: "/logo/pwa-192x192.png",
        sizes: "192x192",
        type: "image/png"
      }, {
        src: "/logo/pwa-512x512.png",
        sizes: "512x512",
        type: "image/png"
      }, {
        src: "/logo/maskable-icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }]
    },
    experimental: {
      directoryAndTrailingSlashHandler: true,
    } /* your pwa options */
  })],
  experimental: {
    contentCollectionCache: true
  },
  output: "hybrid",
  prefetch: {
    defaultStrategy: "viewport",
    prefetchAll: true
  },
  adapter: cloudflare()
});