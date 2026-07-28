import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: change 'hr-timeline-tracker' to your actual GitHub repo name
// before deploying, e.g. if your repo is github.com/MariamElfadaly/hr-tracker
// then base should be '/hr-tracker/'.
export default defineConfig({
  plugins: [react()],
  base: '/hr-timeline-tracker/',
})
