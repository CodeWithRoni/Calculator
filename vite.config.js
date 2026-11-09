import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// Follow the actual GitHub repository name before and after renaming.
export default defineConfig(({ mode }) => {
  const repository = process.env.GITHUB_REPOSITORY?.split('/').pop() || 'Calculator'
  return {
    plugins: [react()],
    base: mode === 'pages' ? '/' + repository + '/' : './',
  }
})
