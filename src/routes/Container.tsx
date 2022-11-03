import React, { memo, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, IconButton, Stack, Input, InputGroup, InputLeftElement, chakra } from '@chakra-ui/react';
import { PlusSquareIcon, SearchIcon } from '@chakra-ui/icons';
import Cassette from '../components/Cassette/Cassette';
import { useAppDispatch, useFileListSelector, useIsLoadingSelector, useUser } from '../reducks/hooks';
import {
	copyFile,
	createNewFile,
	createNewSampleFile,
	fetchFileList,
	FileType,
	putFileInTrash,
	sortFiles,
} from '../reducks/slice/fileListSlice';
import { auth } from '../firebase';
import { FaEdit, FaCopy, FaTrash } from 'react-icons/fa';
import Loading from '../components/Atoms/Loading';
import NoCassettes from '../components/Cassette/NoCassettes';
import ListWrapper from './Layout/ListWrapper';

const Container = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { files } = useFileListSelector();
	const { user } = useUser();
	const icons = [
		{
			icon: FaEdit,
			onClick: ({ file }: { file: FileType }) => {
				const { id } = file;
				navigate(`/file/${id}/editor/`);
			},
			ariaLabel: 'edit this file',
		},
		{
			icon: FaTrash,
			onClick: async ({ file }: { file: FileType }) => {
				const { id } = file;
				await dispatch(putFileInTrash({ id }));
				dispatch(sortFiles({ listType: 'trashes', orderBy: 'desc' }));
			},
			ariaLabel: 'delete this file',
		},
		{
			icon: FaCopy,
			onClick: async ({ file }: { file: FileType }) => {
				await dispatch(copyFile(file));
			},
			ariaLabel: 'copy this file',
		},
	];

	// 既存登録者ならファイルをfetch
	useEffect(() => {
		if (!user.isNewRegistrant && !files.isFetched) dispatch(fetchFileList());
	}, [files.isFetched]);

	// 新規登録者ならサンプルメモを作成する
	useEffect(() => {
		if (user.isNewRegistrant) {
			dispatch(createNewSampleFile());
		}
	}, []);

	/**
	 * 新規作成ボタン押下挙動
	 */
	const handleClick: React.MouseEventHandler = async () => {
		try {
			const originalPromiseResult = await dispatch(createNewFile()).unwrap();
			if (!originalPromiseResult) return;
			const { id } = originalPromiseResult;
			navigate(`/file/${id}/editor`);
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<>
			<ListWrapper page="trashes" list={files} icons={icons} />
			<IconButton
				aria-label="open new editor"
				icon={<PlusSquareIcon w={6} h={6} />}
				colorScheme="teal"
				rounded="full"
				position="absolute"
				bottom="4"
				right="4"
				w="16"
				h="16"
				boxShadow="lg"
				onClick={handleClick}
			></IconButton>
		</>
	);
};

export default Container;
