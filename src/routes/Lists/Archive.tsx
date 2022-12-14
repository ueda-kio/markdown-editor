import { useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import { BiArchiveOut } from 'react-icons/bi';
import { useAppDispatch, useFileListSelector } from '../../reducks/selectors';
import { fetchArchiveList, FileType, putFileInTrash, restoreArchivedFile, sortFiles } from '../../reducks/slice/fileListSlice';
import ListWrapper from '../Layout/ListWrapper';

const Archive = () => {
	const dispatch = useAppDispatch();
	const { archives } = useFileListSelector();
	const menus = [
		{
			icon: BiArchiveOut,
			onClick: async ({ file }: { file: FileType }) => {
				const { id } = file;
				await dispatch(restoreArchivedFile({ id }));
				dispatch(sortFiles({ listType: 'files', orderBy: 'desc' }));
			},
			text: 'Restore Archive',
		},
		{
			icon: FaTrash,
			onClick: async ({ file }: { file: FileType }) => {
				const { id } = file;
				await dispatch(putFileInTrash({ id, isArchive: true }));
				dispatch(sortFiles({ listType: 'trashes', orderBy: 'desc' }));
			},
			text: 'Delete',
		},
	];

	useEffect(() => {
		if (archives.isFetched === false) dispatch(fetchArchiveList());
	}, []);

	return <ListWrapper page="archives" list={archives.list} menus={menus} />;
};

export default Archive;
