import React, { useEffect } from 'react';
import { FaTrashRestore, FaTrash } from 'react-icons/fa';
import { useAppDispatch, useFileListSelector } from '../../reducks/selectors';
import { deleteFileCompletely, fetchTrashList, FileType, restoreTrashedFile, sortFiles } from '../../reducks/slice/fileListSlice';
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
