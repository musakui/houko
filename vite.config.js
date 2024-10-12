import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import uno from 'unocss/vite'

export default defineConfig({
	plugins: [
		uno(),
		vue(),
	],
})
