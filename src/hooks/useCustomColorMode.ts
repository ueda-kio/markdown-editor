import React, { useEffect, useState } from 'react';
import { useColorMode } from '@chakra-ui/react';

const isSystem = () => window.localStorage.getItem('chakra-ui-color-mode-is-system') === 'true';

export const colorModeType = ['light', 'dark', 'system'] as const;
export type ColorMode = typeof colorModeType[number];

const useCustomColorMode = () => {
	const { colorMode: defaultColorMode, setColorMode: defaultSetColorMode } = useColorMode();
	const [colorMode, setColorModeState] = useState<ColorMode | ''>('');

	const setColorMode = (props: ColorMode) => {
		defaultSetColorMode(props);
		setColorModeState(props);
	};

	useEffect(() => {
		if (colorMode === '') return;

		try {
			if (colorMode === 'system') {
				window.localStorage.setItem('chakra-ui-color-mode', 'system');
				window.localStorage.setItem('chakra-ui-color-mode-is-system', 'true');
			} else {
				window.localStorage.setItem('chakra-ui-color-mode-is-system', 'false');
			}
		} catch {
			console.error('Failed to store to storage.');
		}
	}, [colorMode]);

	// 初期表示時
	useEffect(() => {
		if (isSystem()) {
			defaultSetColorMode('dark');
			setColorModeState('system');

			try {
				window.localStorage.setItem('chakra-ui-color-mode', 'system');
			} catch {
				console.error('Failed to store to storage.');
			}
		} else {
			setColorModeState(defaultColorMode);
		}
	}, []);

	return { colorMode, setColorMode };
};

export default useCustomColorMode;
