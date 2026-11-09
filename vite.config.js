import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// GitHub Pages at /calculator-react/; Electron/Capacitor open local files.
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'pages' ? '/calculator-react/' : './',
}))
