import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, IconButton, Stack, Input, InputGroup, InputLeftElement, chakra } from '@chakra-ui/react';
import { PlusSquareIcon, SearchIcon } from '@chakra-ui/icons';
import Cassette from '../components/Cassette/Cassette';
import { useAppDispatch, useFileListSelector, useFilesSelector, useIsLoadingSelector, useUser } from '../reducks/hooks';
import { copyFile, createNewFile, fetchFileList, FileType, putFileInTrash, sortFiles } from '../reducks/slice/fileListSlice';
import { auth, db } from '../firebase';
import { trashFile } from '../libs/firebase.operation';
import { FaEdit, FaCopy, FaTrash } from 'react-icons/fa';
import Loading from '../components/Atoms/Loading';

const Container = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { files } = useFilesSelector();
	const { isLoading } = useIsLoadingSelector();
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

	const signOut = () => {
		auth.signOut();
		navigate('/signin');
	};

	return (
		<Box position="relative" height="calc(100% - 68px)" pb="24" mt="5" _before={{ content: '""', display: 'block' }}>
			{isLoading ? (
				<Loading />
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
				// onClick={signOut}
			></IconButton>
		</Box>
	);
};

export default Container;
