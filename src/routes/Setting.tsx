import React, { useEffect, useState } from 'react';
import { Box, FormControl, FormLabel, HStack, Radio, RadioGroup, StackDivider, Switch, useColorMode, VStack } from '@chakra-ui/react';
import { nanoid } from '@reduxjs/toolkit';
import { ListType, setListType as setListTypeReducer } from '../reducks/slice/fileListSlice';
import { isListType } from '../libs/isListType';
import { useAppDispatch, useListTypeSelector } from '../reducks/hooks';

const Setting = () => {
	const dispatch = useAppDispatch();
	const { colorMode, setColorMode } = useColorMode();
	const { listType: listTypeState } = useListTypeSelector();
	const [listType, setListType] = useState<ListType>(listTypeState);
	const handleChangeTheme = (e: string) => {
		setColorMode(e);
	};
	/** リストタイプの切り替え処理 */
	const handleChangeListType = (e: string) => {
		if (!isListType(e)) return;
		setListType(e);
	};

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
					<RadioGroup defaultValue={listType} onChange={handleChangeListType}>
						<VStack>
							<Radio value="list">list</Radio>
							<Radio value="panel">panel</Radio>
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
