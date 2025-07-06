import { defineConfig } from 'vite'

export default defineConfig({
  // The base option is good for deploying to GitHub Pages.

  base: './', 
    build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      input: 'index.html',
      external: [],
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  server: {
    port: 3000,
    open: true
  },
  // DO NOT add a 'resolve.alias' section.
  // Vite automatically finds your installed packages.
})
// import { defineConfig } from 'vite'

// export default defineConfig({
//   base: './',
//   build: {
//     outDir: 'dist',
//     assetsDir: 'assets',
//     sourcemap: false,
//     minify: 'terser',
//     rollupOptions: {
//       input: 'index.html',
//       external: [],
//       output: {
//         entryFileNames: 'assets/[name]-[hash].js',
//         chunkFileNames: 'assets/[name]-[hash].js',
//         assetFileNames: 'assets/[name]-[hash].[ext]'
//       }
//     }
//   },
//   server: {
//     port: 3000,
//     open: true
//   },
//   resolve: {
//     alias: {
//       'three': 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
//       'gsap': 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js'
//     }
//   }
// })