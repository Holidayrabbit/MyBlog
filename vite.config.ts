import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  return {
    plugins: [react()],
    // 开发环境使用根路径，生产环境使用GitHub Pages路径
    base: command === 'serve' ? '/' : '/MyBlog/',
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
      format: 'es'
    }
  }
})
