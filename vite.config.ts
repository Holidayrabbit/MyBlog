import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  return {
    plugins: [react()],
    // 用户站点部署在根路径，开发和生产都使用根路径
    base: '/',
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
