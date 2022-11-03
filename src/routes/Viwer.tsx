import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Spinner } from '@chakra-ui/react';
import MarkdownViewer from '../components/Organisms/MarkdownViwer';
import {
	copyFile,
	deleteFileCompletely,
	fetchFileById,
	FileListType,
	FileType,
	putFileInArchive,
	putFileInTrash,
	restoreArchivedFile,
	restoreTrashedFile,
} from '../reducks/slice/fileListSlice';
import { useAppDispatch, useFileListSelector, useIsLoadingSelector } from '../reducks/hooks';
import ViwerWrapper from './Layout/ViwerWrapper';
import { FaCopy, FaEdit, FaTrash, FaTrashRestore, FaArchive } from 'react-icons/fa';
import { BiArchiveOut } from 'react-icons/bi';

const getFile = (fileObj: { list: FileType[]; isFetched: boolean }, id: string) => {
	return fileObj.list.find((file) => file.id === id);
};

const Viwer = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { fileId } = useParams();
	const { files, trashes, archives } = useFileListSelector();
	const { isLoading } = useIsLoadingSelector();
	const [file, setFile] = useState<FileType>();
	const [forList, setForList] = useState<FileListType>('files');

	/** urlのidと同じファイルをstateから取得する */
	const getFileById = useCallback(async (id: string) => {
		const forFiles = getFile(files, id);
		const forTrashes = getFile(trashes, id);
		const forArchives = getFile(archives, id);
		switch (true) {
			case typeof forFiles !== 'undefined': {
				setForList('files');
				return forFiles;
			}
			case typeof forTrashes !== 'undefined': {
				setForList('trashes');
				return forTrashes;
			}
			case typeof forArchives !== 'undefined': {
				setForList('archives');
				return forArchives;
			}
			default: {
				const res = await dispatch(fetchFileById({ id })).unwrap();
				if (typeof res === 'undefined') return;
				setForList(res.fileListType);
				return res.data;
			}
		}
	}, []);

	// ファイルのvalueをテキストエリアに反映
	useEffect(() => {
		(async () => {
			if (!fileId) return;
			const file = await getFileById(fileId);
			if (!file) return;
			setFile(file);
		})();
	}, []);

	const editMenuItem = {
		icon: FaEdit,
		onClick: async ({ file: { id } }: { file: FileType }) => {
			navigate(`/file/${id}/editor/`);
		},
		text: 'Edit',
	};
	const copyMenuItem = {
		icon: FaCopy,
		onClick: async ({ file }: { file: FileType }) => {
			await dispatch(copyFile(file));
		},
		text: 'Copy',
	};
	const trashMenuItem = {
		icon: FaTrash,
		onClick: async ({ file: { id } }: { file: FileType }) => {
			await dispatch(putFileInTrash({ id }));
			navigate('/');
		},
		text: 'Delete',
	};
	const trashCompletelyMenuItem = {
		icon: FaTrash,
		onClick: async ({ file: { id } }: { file: FileType }) => {
			await dispatch(deleteFileCompletely({ id }));
			navigate('/trash');
		},
		text: 'Delete Completely',
	};
	const archiveMenuItem = {
		icon: FaArchive,
		onClick: async ({ file: { id } }: { file: FileType }) => {
			await dispatch(putFileInArchive({ id }));
			navigate('/');
		},
		text: 'Archive',
	};
	const restoreTrashMenuItem = {
		icon: FaTrashRestore,
		onClick: async ({ file: { id } }: { file: FileType }) => {
			await dispatch(restoreTrashedFile({ id }));
			navigate('/trash');
		},
		text: 'Restore Trash',
	};
	const restoreArchiveMenuItem = {
		icon: BiArchiveOut,
		onClick: async ({ file: { id } }: { file: FileType }) => {
			await dispatch(restoreArchivedFile({ id }));
			navigate('/archive');
		},
		text: 'Restore Archive',
	};
	const menuItemObj = {
		file: [editMenuItem, copyMenuItem, trashMenuItem, archiveMenuItem],
		trash: [restoreTrashMenuItem, trashCompletelyMenuItem],
		archive: [trashMenuItem, restoreArchiveMenuItem],
	};

	const getMenusArray = useCallback(() => {
		if (!fileId) return menuItemObj.file;
		switch (forList) {
			case 'files':
				return menuItemObj.file;
			case 'trashes':
				return menuItemObj.trash;
			case 'archives':
				return menuItemObj.archive;
		}
	}, [fileId, forList]);

	const menus = useMemo(() => {
		return getMenusArray();
	}, [fileId, forList]);

	return (
		<>
			{isLoading || typeof file === 'undefined' ? (
				<Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
			) : (
				<ViwerWrapper menus={menus} file={file}>
					<MarkdownViewer markdownText={file.value} mt="4" />
				</ViwerWrapper>
			)}
		</>
	);
};

export default Viwer;
