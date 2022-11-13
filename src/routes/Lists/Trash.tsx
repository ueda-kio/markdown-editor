import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, IconButton, Spinner, Stack, chakra } from '@chakra-ui/react';
import { PlusSquareIcon } from '@chakra-ui/icons';
import Cassette from '../../components/Cassette/Cassette';
import { useAppDispatch, useIsLoadingSelector, useFileListSelector } from '../../reducks/selectors';
import { deleteFileCompletely, fetchTrashList, FileType, restoreTrashedFile, sortFiles } from '../../reducks/slice/fileListSlice';
import { FaTrashRestore, FaTrash } from 'react-icons/fa';
import NoCassettes from '../../components/Cassette/NoCassettes';
import ListWrapper from '../Layout/ListWrapper';

const Trash = () => {
	const dispatch = useAppDispatch();
	const { trashes } = useFileListSelector();
	const menus = [
		{
			icon: FaTrashRestore,
			onClick: async ({ file }: { file: FileType }) => {
				const { id } = file;
				await dispatch(restoreTrashedFile({ id }));
				dispatch(sortFiles({ listType: 'files', orderBy: 'desc' }));
			},
			text: 'Restore Trash',
		},
		{
			icon: FaTrash,
			onClick: ({ file }: { file: FileType }) => {
				const { id } = file;
				dispatch(deleteFileCompletely({ id }));
			},
			text: 'Delete Completely',
		},
	];

	useEffect(() => {
		if (trashes.isFetched === false) dispatch(fetchTrashList());
	}, []);

	return <ListWrapper page="trashes" list={trashes.list} menus={menus} />;
};

export default Trash;
