import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, IconButton, Spinner, Stack, chakra } from '@chakra-ui/react';
import { PlusSquareIcon } from '@chakra-ui/icons';
import Cassette from '../components/Cassette/Cassette';
import { useAppDispatch, useIsLoadingSelector, useFileListSelector } from '../reducks/hooks';
import { deleteFileCompletely, fetchTrashList, FileType, restoreTrashedFile, sortFiles } from '../reducks/slice/fileListSlice';
import { FaTrashRestore, FaTrash } from 'react-icons/fa';
import NoCassettes from '../components/Cassette/NoCassettes';
import ListWrapper from './Layout/ListWrapper';

const Trashes = () => {
	const dispatch = useAppDispatch();
	const { trashes } = useFileListSelector();
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

	return <ListWrapper page="trashes" list={trashes} icons={icons} />;
};

export default Trashes;
