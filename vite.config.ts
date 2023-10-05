import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
	plugins: [dts()],
	build: {
		lib: {
			entry: 'src/index.ts',
			name: 'axp-ts',
			fileName: 'index'
		}
	}
})
