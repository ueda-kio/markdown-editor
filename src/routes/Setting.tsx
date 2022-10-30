import React from 'react';
import { Box, FormControl, FormLabel, HStack, Radio, RadioGroup, useColorMode } from '@chakra-ui/react';

const Setting = () => {
	const { colorMode, setColorMode } = useColorMode();
	const handleChangeTheme = (e: string) => {
		setColorMode(e);
	};
	return (
		<Box maxWidth="max" m="0 auto">
			<FormControl as="fieldset">
				<FormLabel as="legend">theme</FormLabel>
				<RadioGroup defaultValue={colorMode} onChange={handleChangeTheme}>
					<HStack>
						<Radio value="light">light</Radio>
						<Radio value="dark">dark</Radio>
						<Radio value="system">system</Radio>
					</HStack>
				</RadioGroup>
			</FormControl>
		</Box>
	);
};

export default Setting;
