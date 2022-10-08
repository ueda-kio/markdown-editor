import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
	return {
		plugins: [
			// Emotionが提供するcssプロパティ等を反映するために必要となる
			react({
				jsxImportSource: '@emotion/react',
				babel: {
					plugins: ['@emotion/babel-plugin'],
				},
			}),
		],
		// Fixed: [vite] warning: Top-level "this" will be replaced with undefined since this file is an ECMAScript module
		esbuild: {
			logOverride: { 'this-is-undefined-in-esm': 'silent' },
		},
	};
});
