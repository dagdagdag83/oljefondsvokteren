import { defineConfig } from 'vite'
import path from 'node:path'

export default defineConfig({
	server: {
		port: 5173,
		strictPort: true,
		proxy: {
			// For local dev: proxy to a local backend if available
			'/api': {
				target: process.env.VITE_DEV_BACKEND_URL || 'http://localhost:8080',
				changeOrigin: true,
				rewrite: (p) => p.replace(/^\/api/, ''),
			},
		},
	},
	build: {
		outDir: 'dist',
		assetsDir: 'assets',
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
})


