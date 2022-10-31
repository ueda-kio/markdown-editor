import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, IconButton, Spinner, Stack, chakra } from '@chakra-ui/react';
import { PlusSquareIcon } from '@chakra-ui/icons';
import Cassette from '../components/Cassette/Cassette';
import { useAppDispatch, useIsLoadingSelector, useFileListSelector } from '../reducks/hooks';
import { deleteFileCompletely, fetchTrashList, FileType, restoreTrashedFile, sortFiles } from '../reducks/slice/fileListSlice';
import { FaTrashRestore, FaTrash } from 'react-icons/fa';
import NoCassettes from '../components/Organisms/NoCassettes';

const Trashes = () => {
	const dispatch = useAppDispatch();
	const { trashes } = useFileListSelector();
	const { isLoading } = useIsLoadingSelector();
	const icons = [
		{
			icon: FaTrashRestore,
			onClick: async ({ file }: { file: FileType }) => {
				const { id } = file;
				await dispatch(restoreTrashedFile({ id }));
				dispatch(sortFiles({ listType: 'files', orderBy: 'desc' }));
			},
			ariaLabel: 'test-label',
		},
		{
			icon: FaTrash,
			onClick: ({ file }: { file: FileType }) => {
				const { id } = file;
				dispatch(deleteFileCompletely({ id }));
			},
			ariaLabel: 'test-label',
		},
	];

	useEffect(() => {
		if (trashes.isFetched === false) dispatch(fetchTrashList());
	}, [trashes.isFetched]);

	const Empty = useMemo(() => <NoCassettes page="trashes" />, []);
	return (
		<Box position="relative" mt="5" pb="8" flexGrow={'1'} overflow="auto" _before={{ content: '""', display: 'block' }}>
			{isLoading ? (
				<Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
			) : trashes.list.length ? (
				<Stack spacing="2" as="ol" height="100%" overflowY="auto" px="3" pt="1" pb="3">
					{trashes.list.map((file, i) => (
						<li key={`${file.id}_${i}`}>
							<Cassette file={file} icons={icons} />
						</li>
					))}
				</Stack>
			) : (
				<>{Empty}</>
			)}
		</Box>
	);
};

export default Trashes;
