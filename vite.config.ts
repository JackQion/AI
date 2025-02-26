import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://152.136.37.136:3000',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, '')
      }
    }
  }
});


// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   optimizeDeps: {
//     exclude: ['lucide-react'],
//   },
//   server: {
//     proxy: {
//       '/v1/api': {
//         target: 'http://152.136.37.136:3000',  // 后端 API 服务器地址
//         changeOrigin: true,  // 允许代理请求的源改变
//         rewrite: (path) => path.replace(/^\/v1\/api/, '') // 可选：重写请求路径
//       }
//     }
//   }
// });
