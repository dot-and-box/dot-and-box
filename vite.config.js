// vite.config.js
import { defineConfig } from 'vite'


export default defineConfig({
    build: {
        lib: {
            // Could also be a dictionary or array of multiple entry points
            entry: ['src/dotAndBoxElement.ts'],
            name: 'DotAndBox',
            // the proper extensions will be added
            fileName: 'dot-and-box',
        }
    },
})
