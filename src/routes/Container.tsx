import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, IconButton, Spinner, Stack, Input, InputGroup, InputLeftElement, chakra } from '@chakra-ui/react';
import { PlusSquareIcon, SearchIcon } from '@chakra-ui/icons';
import Cassette from '../components/Cassette/Cassette';
import { useAppDispatch, useFileListSelector, useFilesSelector, useIsLoadingSelector } from '../reducks/hooks';
import { createNewFile, fetchFileList, putFileInTrash, sortFiles } from '../reducks/slice/fileListSlice';
import { db } from '../firebase';
import { trashFile } from '../libs/firebase.operation';
import { FaEdit, FaCopy, FaTrash } from 'react-icons/fa';

const Container = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { files } = useFilesSelector();
	const { isLoading } = useIsLoadingSelector();
	const icons = [
		{
			icon: FaEdit,
			onClick: (id: string) => {
				navigate(`/file/${id}/editor/`);
			},
			ariaLabel: 'edit this file',
		},
		{
			icon: FaTrash,
			onClick: (id: string) => {
				dispatch(putFileInTrash({ id }));
				dispatch(sortFiles({ listType: 'trashes', orderBy: 'desc' }));
			},
			ariaLabel: 'delete this file',
		},
		{
			icon: FaCopy,
			onClick: (id: string) => {
				console.log(id);
			},
			ariaLabel: 'copy this file',
		},
	];

	useEffect(() => {
		if (files.isFetched === false) dispatch(fetchFileList());
	}, [files.isFetched]);

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
		<Box position="relative" height="calc(100% - 68px)" pb="24" mt="5" _before={{ content: '""', display: 'block' }}>
			{isLoading ? (
				<Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
			) : (
				<Stack spacing="2" as="ol" height="100%" overflowY="auto" px="3">
					{files.list.map((file, i) => (
						<li key={`${file.id}_${i}`}>
							<Cassette file={file} icons={icons} />
						</li>
					))}
				</Stack>
			)}
			<IconButton
				aria-label="open new editor"
				icon={<PlusSquareIcon w={6} h={6} />}
				colorScheme="teal"
				rounded="full"
				position="fixed"
				bottom="4"
				right="4"
				w="16"
				h="16"
				onClick={handleClick}
			></IconButton>
		</Box>
	);
};

export default Container;
