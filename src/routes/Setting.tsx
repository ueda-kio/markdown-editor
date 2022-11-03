import React from 'react';
import {
	Box,
	FormControl,
	FormLabel,
	HStack,
	IconButton,
	Radio,
	RadioGroup,
	Stack,
	StackDivider,
	Switch,
	useColorMode,
	VStack,
} from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { nanoid } from '@reduxjs/toolkit';

const Setting = () => {
	const navigate = useNavigate();
	const { colorMode, setColorMode } = useColorMode();
	const handleChangeTheme = (e: string) => {
		setColorMode(e);
	};
	const switchArray = [
		{ label: '自動並び替え', id: nanoid(), handleChange: () => console.log('test') },
		{ label: 'ショートカットで保存', id: nanoid(), handleChange: () => console.log('test') },
	];
	return (
		<Box maxWidth="max">
			<VStack divider={<StackDivider h="1px" bg="gray.200" />} spacing="4" align="stretch">
				<FormControl as="fieldset">
					<FormLabel>theme</FormLabel>
					<RadioGroup defaultValue={colorMode} onChange={handleChangeTheme}>
						<HStack>
							<Radio value="light">light</Radio>
							<Radio value="dark">dark</Radio>
							<Radio value="system">system</Radio>
						</HStack>
					</RadioGroup>
				</FormControl>
				<FormControl as="fieldset" display={'flex'}>
					<FormLabel>style</FormLabel>
					<RadioGroup defaultValue={colorMode} onChange={handleChangeTheme}>
						<VStack>
							<Radio value="light">list</Radio>
							<Radio value="dark">panel</Radio>
						</VStack>
					</RadioGroup>
				</FormControl>
				{switchArray.map((elm) => (
					<FormControl key={elm.label} display="flex" alignItems="center" justifyContent={'space-between'}>
						<FormLabel htmlFor={elm.id} mb="0" flexGrow={'1'} cursor="pointer">
							{elm.label}
						</FormLabel>
						<Switch id={elm.id} onChange={elm.handleChange} />
					</FormControl>
				))}
			</VStack>
		</Box>
	);
};

export default Setting;
