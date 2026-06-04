import { defineConfig, type Plugin } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { VitePWA } from 'vite-plugin-pwa';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Base path: set to "/japanese/" when deploying to GitHub Pages project site.
// Leave as "/" for Vercel/Netlify or local dev. Override with BASE env var.
const base = process.env.BASE ?? '/';

// The kuromoji dictionary ships as pre-gzipped *.dat.gz files which kuromoji
// fetches and gunzips itself. Vite's dev server, however, serves any *.gz file
// with `Content-Encoding: gzip`, so the browser transparently decompresses it —
// then kuromoji double-gunzips and the tokenizer (furigana) silently fails.
// This plugin serves /dict/*.gz as raw bytes with no Content-Encoding.
function serveDictRaw(): Plugin {
  return {
    name: 'serve-dict-raw',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0] ?? '';
        if (url.includes('/dict/') && url.endsWith('.gz')) {
          const file = join(process.cwd(), 'public', url);
          if (existsSync(file)) {
            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.end(readFileSync(file));
            return;
          }
        }
        next();
      });
    }
  };
}

export default defineConfig({
  base,
  plugins: [
    serveDictRaw(),
    svelte(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: null,
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Nihongo Quest — Learn Japanese',
        short_name: 'Nihongo Quest',
        description: 'Learn Japanese: kana, kanji, vocab & spaced-repetition flashcards.',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait',
        start_url: base,
        scope: base,
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2,wasm}'],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
        // Cache the kuromoji dictionary files at runtime (first use) so furigana
        // works offline afterwards without bloating the precache.
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.includes('/dict/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'kuromoji-dict',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 90 }
            }
          }
        ]
      }
    })
  ],
  optimizeDeps: {
    exclude: ['sql.js']
  }
});
