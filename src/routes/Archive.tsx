import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, IconButton, Spinner, Stack, chakra } from '@chakra-ui/react';
import { PlusSquareIcon } from '@chakra-ui/icons';
import Cassette from '../components/Cassette/Cassette';
import { useAppDispatch, useFileListSelector, useIsLoadingSelector, useTrashesSelector } from '../reducks/hooks';
import {
	deleteFileCompletely,
	fetchArchiveList,
	fetchTrashList,
	FileType,
	putFileInTrash,
	restoreArchivedFile,
	restoreTrashedFile,
	sortFiles,
} from '../reducks/slice/fileListSlice';
import { FaTrashRestore, FaTrash } from 'react-icons/fa';
import { BiArchiveOut } from 'react-icons/bi';
import NoCassettes from '../components/Organisms/NoCassettes';

const Archive = () => {
	const dispatch = useAppDispatch();
	const { archives } = useFileListSelector();
	const { isLoading } = useIsLoadingSelector();
	const icons = [
		{
			icon: BiArchiveOut,
			onClick: async ({ file }: { file: FileType }) => {
				const { id } = file;
				await dispatch(restoreArchivedFile({ id }));
				dispatch(sortFiles({ listType: 'files', orderBy: 'desc' }));
			},
			ariaLabel: 'test-label',
		},
		{
			icon: FaTrash,
			onClick: async ({ file }: { file: FileType }) => {
				const { id } = file;
				await dispatch(putFileInTrash({ id, isArchive: true }));
				dispatch(sortFiles({ listType: 'trashes', orderBy: 'desc' }));
			},
			ariaLabel: 'test-label',
		},
	];

	useEffect(() => {
		if (archives.isFetched === false) dispatch(fetchArchiveList());
	}, [archives.isFetched]);

	const Empty = useMemo(() => <NoCassettes page="archive" />, []);
	return (
		<Box position="relative" mt="5" pb="8" flexGrow={'1'} overflow="auto" _before={{ content: '""', display: 'block' }}>
			{isLoading ? (
				<Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
			) : archives.list.length ? (
				<Stack spacing="2" as="ol" height="100%" overflowY="auto" px="3" pt="1" pb="3">
					{archives.list.map((file, i) => (
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

export default Archive;
