import createCache from '@emotion/cache';

export default function createEmotionCache() {
	return createCache({ key: 'css', ...(process.env.NODE_ENV === 'development' && { stylisPlugins: [] }) });
}
