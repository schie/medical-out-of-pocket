import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  base: '/medical-out-of-pocket/',
  plugins: [react(), tailwindcss()],
  define: {
    __VERSION__: JSON.stringify(process.env.npm_package_version),
  },
});
