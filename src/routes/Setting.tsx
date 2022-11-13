import React, { useEffect, useState } from 'react';
import { Box, FormControl, FormLabel, Grid, StackDivider, Switch, Text, useColorModeValue, VStack } from '@chakra-ui/react';
import { nanoid } from '@reduxjs/toolkit';
import { ListType, setListType as setListTypeReducer } from '../reducks/slice/fileListSlice';
import { isListType } from '../libs/isListType';
import { useAppDispatch, useListTypeSelector } from '../reducks/selectors';
import { css } from '@emotion/react';
import useCustomColorMode from '../hooks/useCustomColorMode';
import IsColorModeType from '../libs/isColorModeType';

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

// type ColorMode = DefaultColorMode | 'system';

type RadioProps = {
	name: string;
	value: string;
	label: string;
	checked: boolean;
	onChange: (e: string) => void;
	children: React.ReactNode;
};
const BigRadio: React.FC<RadioProps> = ({ name, value, label, checked, onChange, children }) => {
	const boxShadowWhenChecked = useColorModeValue(
		'0px 0px 0px 2px rgba(210, 210, 210, 1) inset',
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
			<Box
				as={'span'}
				display="block"
				rounded={'md'}
				p={{ base: '1', sm: '2' }}
				transitionProperty="var(--chakra-transition-property-common)"
				transitionDuration="var(--chakra-transition-duration-normal)"
			>
				<Box as={'span'} aria-hidden="true">
					{children}
				</Box>
				<Text as="span" display={'block'} fontSize="sm" align="center" mt="1">
					{label}
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
	const handleChangeTheme = (e: string) => {
		if (IsColorModeType(e)) {
			setColorMode(e);
		}
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
		<VStack divider={<StackDivider h="1px" bg="gray.200" />} spacing="4" align="stretch" maxWidth="max" mt="5">
			<FormControl as="fieldset">
				<Box
					as={'dl'}
					display={{ base: 'block', md: 'grid' }}
					gap={{ base: undefined, md: '4' }}
					gridTemplateColumns={{ base: undefined, md: '200px 1fr' }}
				>
					<Box as={'dt'} m="0" fontSize={{ base: '16px', md: '18px' }}>
						Theme preferences
					</Box>
					<Grid
						as="dd"
						templateColumns={'repeat(3, 1fr)'}
						gap={{ base: '1', sm: '2' }}
						mt={{ base: '4', md: 0 }}
						pr={{ base: 0, md: '4' }}
					>
						<BigRadio
							name="color-mode"
							value="light"
							label="Light"
							checked={colorMode === 'light'}
							onChange={handleChangeTheme}
						>
							<Box
								w="100%"
								bg="white"
								border={'1px'}
								borderColor={useColorModeValue('gray.200', 'gray.400')}
								css={{ aspectRatio: '5/3' }}
							></Box>
						</BigRadio>
						<BigRadio name="color-mode" value="dark" label="Dark" checked={colorMode === 'dark'} onChange={handleChangeTheme}>
							<Box
								w="100%"
								bg="black"
								border={'1px'}
								borderColor={useColorModeValue('gray.200', 'gray.400')}
								css={{ aspectRatio: '5/3' }}
							></Box>
						</BigRadio>
						<BigRadio
							name="color-mode"
							value="system"
							label="System"
							checked={colorMode === 'system'}
							onChange={handleChangeTheme}
						>
							<Box
								w="100%"
								border={'1px'}
								borderColor={useColorModeValue('gray.200', 'gray.400')}
								bg="white"
								css={{ aspectRatio: '5/3' }}
							>
								<Box w="100%" h="100%" bg="black" clipPath={'polygon(100% 0, 0% 100%, 100% 100%)'}></Box>
							</Box>
						</BigRadio>
					</Grid>
				</Box>
			</FormControl>
			<FormControl as="fieldset">
				<Box
					as={'dl'}
					display={{ base: 'block', md: 'grid' }}
					gap={{ base: undefined, md: '4' }}
					gridTemplateColumns={{ base: undefined, md: '200px 1fr' }}
				>
					<Box as={'dt'} m="0" fontSize={{ base: '16px', md: '18px' }}>
						List Style
					</Box>
					<Grid
						as="dd"
						templateColumns={'repeat(3, 1fr)'}
						gap={{ base: '1', sm: '2' }}
						mt={{ base: '4', md: 0 }}
						pr={{ base: 0, md: '4' }}
					>
						<BigRadio name="list-style" value="list" label="List" checked={listType === 'list'} onChange={handleChangeListType}>
							<Grid
								gap="1"
								w="100%"
								p="1"
								bg="white"
								border={'1px'}
								borderColor={useColorModeValue('gray.200', 'gray.400')}
								css={{ aspectRatio: '5/3' }}
							>
								{[0, 1, 2, 3].map((el) => (
									<Box key={el} border={'1px'} borderColor={'gray.500'} rounded="4px" />
								))}
							</Grid>
						</BigRadio>
						<BigRadio
							name="list-style"
							value="panel"
							label="Panel"
							checked={listType === 'panel'}
							onChange={handleChangeListType}
						>
							<Grid
								gap="1"
								templateRows={'repeat(2, 1fr)'}
								templateColumns={'repeat(2, 1fr)'}
								w="100%"
								p="1"
								bg="white"
								border={'1px'}
								borderColor={useColorModeValue('gray.200', 'gray.400')}
								css={{ aspectRatio: '5/3' }}
							>
								{[0, 1, 2, 3].map((el) => (
									<Box key={el} border={'1px'} borderColor={'gray.500'} rounded="4px" />
								))}
							</Grid>
						</BigRadio>
					</Grid>
				</Box>
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
	);
};

export default Setting;
