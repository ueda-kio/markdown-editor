import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
	colors: {
		brand: {
			100: 'red',
		},
		focusOutline: 'rgba(50, 151, 149, 0.7)',
	},
	sizes: {
		'5xs': '10rem',
		'4xs': '12rem',
		max: '840px',
	},
	shadows: {
		base: '0 1px 3px 0 rgb(0 0 0 / 20%), 0 1px 2px 0 rgb(0 0 0 / 6%)',
		md: '0 4px 6px -1px rgba(0, 0, 0, 20%), 0 2px 4px -1px rgba(0, 0, 0, 6%)',
		lg: '0 8px 10px -3px rgb(0 0 0 / 20%), 0 4px 6px -2px rgb(0 0 0 / 25%)',
		top: '0px -4px 12px -8px #a3a3a3',
		outline: '0 0 0 3px var(--chakra-colors-focusOutline)',
	},
	styles: {
		global: {
			body: {
				transitionProperty: 'all',
				transitionDuration: 'normal',
			},
		},
	},
	breakpoints: {
		xl: '83em',
	},
	config: {
		disableTransitionOnChange: false,
	},
	initialColorMode: 'system',
	useSystemColorMode: false,
});

export default theme;
