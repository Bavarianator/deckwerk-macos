import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // onnxruntime-node (Freisteller) ist ein natives Modul (.node) und muss zur Laufzeit aus node_modules kommen
  main: { build: { externalizeDeps: false, rollupOptions: { external: ['onnxruntime-node'] } } },
  preload: {},
  // "use client" in lucide-react ist nur für Server-Components relevant, im Bundle bedeutungslos
  renderer: {
    plugins: [react()],
    build: { rollupOptions: { onwarn: (w, warn) => { if (w.code !== 'MODULE_LEVEL_DIRECTIVE') warn(w) } } },
  },
})
