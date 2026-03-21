import { defineConfig } from 'vite'
import wind from '@tailwindcss/vite'

export default defineConfig({
	plugins: [
		//
		wind(),
	],
	server: {
		cors: true,
		host: '0.0.0.0',
		allowedHosts: true,
	},
})
