import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 项目站点部署在 /MyBlog/ 子路径
  base: '/MyBlog/',
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  server: {
    port: 5173,
    open: true
  },
  // 优化PDF.js相关依赖
  optimizeDeps: {
    include: ['pdfjs-dist']
  },
  // 配置worker处理
  worker: {
    format: 'es' as const
  }
})
