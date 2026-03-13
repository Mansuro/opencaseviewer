import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// esbuild plugin that stubs Node.js 'zlib' for browser pre-bundling of dicom-parser
const zlibStub = {
  name: 'zlib-stub',
  setup(build) {
    build.onResolve({ filter: /^zlib$/ }, (args) => ({
      path: args.path,
      namespace: 'zlib-stub',
    }))
    build.onLoad({ filter: /.*/, namespace: 'zlib-stub' }, () => ({
      contents: 'module.exports = {}',
      loader: 'js',
    }))
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  optimizeDeps: {
    exclude: ['@cornerstonejs/dicom-image-loader'],
    include: [
      'dicom-parser',
      '@cornerstonejs/dicom-image-loader > @cornerstonejs/codec-libjpeg-turbo-8bit/decodewasmjs',
      '@cornerstonejs/dicom-image-loader > @cornerstonejs/codec-libjpeg-turbo-12bit/decodewasmjs',
      '@cornerstonejs/dicom-image-loader > @cornerstonejs/codec-charls/decodewasmjs',
      '@cornerstonejs/dicom-image-loader > @cornerstonejs/codec-openjpeg/decodewasmjs',
      '@cornerstonejs/dicom-image-loader > @cornerstonejs/codec-openjph/wasmjs',
    ],
    esbuildOptions: {
      plugins: [zlibStub],
    },
  },
})
