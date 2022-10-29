import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
	colors: {
		brand: {
			100: 'red',
		},
	},
	sizes: {
		max: '840px',
	},
	shadows: {
		base: '0 1px 3px 0 rgb(0 0 0 / 20%), 0 1px 2px 0 rgb(0 0 0 / 6%)',
		md: '0 4px 6px -1px rgba(0, 0, 0, 20%), 0 2px 4px -1px rgba(0, 0, 0, 6%)',
		lg: '0 8px 10px -3px rgb(0 0 0 / 20%), 0 4px 6px -2px rgb(0 0 0 / 25%)',
	},
	initialColorMode: 'light',
	useSystemColorMode: false,
});

export default theme;
