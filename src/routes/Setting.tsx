import React, { useEffect, useState } from 'react';
import {
	Box,
	ColorMode as DefaultColorMode,
	FormControl,
	FormLabel,
	Grid,
	Radio,
	RadioGroup,
	StackDivider,
	Switch,
	Text,
	useColorModeValue,
	VStack,
} from '@chakra-ui/react';
import { nanoid } from '@reduxjs/toolkit';
import { ListType, setListType as setListTypeReducer } from '../reducks/slice/fileListSlice';
import { isListType } from '../libs/isListType';
import { useAppDispatch, useListTypeSelector } from '../reducks/hooks';
import { css } from '@emotion/react';
import useCustomColorMode from '../hooks/useCustomColorMode';

const style = {
	label: css`
		background-color: red;
		& > .chakra-radio__control {
			opacity: 0;
			width: 0;
			height: 0;
		}
	`,
	input: css`
		overflow: hidden;
		position: absolute;
		top: 0;
		left: 0;
		width: 0;
		height: 0;
		margin: 0;
		padding: 0;
		opacity: 0;
		transition-property: var(--chakra-transition-property-common);
		transition-duration: var(--chakra-transition-duration-normal);

		&:focus ~ span {
			outline: none;
		}

		&:focus-visible ~ span {
			box-shadow: var(--chakra-shadows-outline);
		}
	`,
};

type ColorMode = DefaultColorMode | 'system';

type RadioProps = {
	name: string;
	value: ColorMode;
	checked: boolean;
	onChange: (e: ColorMode) => void;
	children: React.ReactNode;
};
const BigRadio: React.FC<RadioProps> = ({ name, value, checked, onChange, children }) => {
	const boxShadowWhenChecked = useColorModeValue(
		'0px 0px 0px 2px rgba(225, 225, 225, 1) inset',
		'0px 0px 0px 2px rgba(225, 225, 225, 0.55) inset'
	);
	return (
		<Box
			as={'label'}
			pos="relative"
			bg="var(--chakra-colors-chakra-body-bg)"
			border={'1px'}
			borderColor={useColorModeValue('gray.200', 'gray.400')}
			rounded={'md'}
			transitionProperty="var(--chakra-transition-property-common)"
			transitionDuration="var(--chakra-transition-duration-normal)"
			boxShadow={checked ? boxShadowWhenChecked : undefined}
			_hover={{ bg: useColorModeValue('var(--chakra-colors-gray-100)', 'var(--chakra-colors-whiteAlpha-200)'), cursor: 'pointer' }}
			_active={{ bg: useColorModeValue('var(--chakra-colors-gray-200)', 'var(--chakra-colors-whiteAlpha-300)') }}
		>
			<input type="radio" name={name} value={value} onChange={() => onChange(value)} css={style.input} checked={checked} />
			<Box as={'span'} display="block" rounded={'md'} p="2">
				<Box as={'span'}>{children}</Box>
				<Text as="span" fontSize={'md'}>
					{value}
				</Text>
			</Box>
		</Box>
	);
};

const Setting = () => {
	const dispatch = useAppDispatch();
	const { colorMode, setColorMode } = useCustomColorMode();
	const { listType: listTypeState } = useListTypeSelector();
	const [listType, setListType] = useState<ListType>(listTypeState);

	/** カラーモードの切り替え処理 */
	const handleChangeTheme = (e: ColorMode) => {
		setColorMode(e);
	};

	/** リストタイプの切り替え処理 */
	const handleChangeListType = (e: string) => {
		if (!isListType(e)) return;
		setListType(e);
	};

	//TODO useMemo
	const switchArray = [
		{ label: '自動並び替え', id: nanoid(), handleChange: () => console.log('test') },
		{ label: 'ショートカットで保存', id: nanoid(), handleChange: () => console.log('test') },
	];

	/** 選択されたリストタイプをlocalStorageに格納 */
	useEffect(() => {
		dispatch(setListTypeReducer(listType));
		try {
			window.localStorage.setItem('list-type', listType);
		} catch {
			console.error('Failed to store to storage.');
		}
	}, [listType]);

	return (
		<Box maxWidth="max">
			<VStack divider={<StackDivider h="1px" bg="gray.200" />} spacing="4" align="stretch">
				<FormControl as="fieldset">
					<Box
						as={'dl'}
						display={{ base: 'block', md: 'grid' }}
						gap={{ base: undefined, md: '4' }}
						gridTemplateColumns={{ base: undefined, md: '200px 1fr' }}
					>
						<Box as={'dt'} m="0">
							Theme preferences
						</Box>
						<Grid
							as="dd"
							templateColumns={'repeat(3, 1fr)'}
							gap={{ base: '2', md: '4' }}
							mt={{ base: '4', md: 0 }}
							pr={{ base: 0, md: '4' }}
						>
							<BigRadio name="name" value="light" checked={colorMode === 'light'} onChange={handleChangeTheme}>
								<Box
									w="100%"
									h="70px"
									bg="white"
									border={'1px'}
									borderColor={useColorModeValue('gray.200', 'gray.400')}
								></Box>
							</BigRadio>
							<BigRadio name="name" value="dark" checked={colorMode === 'dark'} onChange={handleChangeTheme}>
								<Box
									w="100%"
									h="70px"
									bg="black"
									border={'1px'}
									borderColor={useColorModeValue('gray.200', 'gray.400')}
								></Box>
							</BigRadio>
							<BigRadio name="name" value="system" checked={colorMode === 'system'} onChange={handleChangeTheme}>
								<Box w="100%" h="70px" border={'1px'} borderColor={useColorModeValue('gray.200', 'gray.400')} bg="white">
									<Box w="100%" h="100%" bg="black" clipPath={'polygon(100% 0, 0% 100%, 100% 100%)'}></Box>
								</Box>
							</BigRadio>
						</Grid>
					</Box>
				</FormControl>
				<FormControl as="fieldset" display={'flex'}>
					<Grid gap="4" templateColumns={'200px 1fr'}>
						<FormLabel m="0">List style</FormLabel>
						<RadioGroup defaultValue={listType} onChange={handleChangeListType}>
							<VStack>
								<Radio value="list">list</Radio>
								<Radio value="panel">panel</Radio>
							</VStack>
						</RadioGroup>
					</Grid>
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
