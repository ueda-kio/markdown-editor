import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, IconButton, Spinner } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import MarkdownViewer from '../components/Organisms/MarkdownViwer';
import {
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
import { RiInboxArchiveFill } from 'react-icons/ri';
import { FaEdit, FaCopy, FaTrash, FaTrashRestore, FaArchive } from 'react-icons/fa';
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
	const [value, setValue] = useState('');
	const [forList, setForList] = useState<FileListType>('files');

	/** urlのidと同じファイルをstateから取得する */
	const getFileById = useCallback(
		async (id: string) => {
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
		},
		[fileId]
	);

	// ファイルのvalueをテキストエリアに反映
	useEffect(() => {
		(async () => {
			if (!fileId) return;
			const file = await getFileById(fileId);
			if (!file) return;
			setValue(file.value);
		})();
	}, []);

	/** 削除処理 */
	const handleTrash = async () => {
		if (!fileId) return;
		await dispatch(putFileInTrash({ id: fileId }));
		navigate('/');
	};
	/** アーカイブ処理 */
	const handleArchive = async () => {
		if (!fileId) return;
		await dispatch(putFileInArchive({ id: fileId }));
		navigate('/');
	};
	/** 完全削除処理 */
	const trashCompletely = async () => {
		if (!fileId) return;
		await dispatch(deleteFileCompletely({ id: fileId }));
		navigate('/trash');
	};
	/** ゴミ箱から戻す */
	const handleRestoreTrash = async () => {
		if (!fileId) return;
		await dispatch(restoreTrashedFile({ id: fileId }));
		navigate('/trash');
	};
	/** アーカイブから戻す */
	const handleRestoreArchive = async () => {
		if (!fileId) return;
		await dispatch(restoreArchivedFile({ id: fileId }));
		navigate('/archive');
	};

	const editButton = { icon: FaEdit, handleClick: () => navigate('./editor'), label: 'edit this file.' };
	const trashButton = { icon: FaTrash, handleClick: handleTrash, label: 'trash this file.' };
	const trashCompletelyButton = { icon: FaTrash, handleClick: trashCompletely, label: 'trash this file completely.' };
	const archiveButton = { icon: FaArchive, handleClick: handleArchive, label: 'archive this file' };
	const restoreTrashButton = { icon: FaTrashRestore, handleClick: handleRestoreTrash, label: 'restore from trash' };
	const restoreArchive = { icon: BiArchiveOut, handleClick: handleRestoreArchive, label: 'restore from archive' };
	const buttonsObj = {
		file: [editButton, trashButton, archiveButton],
		trash: [restoreTrashButton, trashCompletelyButton],
		archive: [editButton, trashButton, restoreArchive],
	};

	const getButtonsArray = useCallback(() => {
		if (!fileId) return buttonsObj.file;
		switch (forList) {
			case 'files':
				return buttonsObj.file;
			case 'trashes':
				return buttonsObj.trash;
			case 'archives':
				return buttonsObj.archive;
		}
	}, [fileId, forList]);

	const buttons = useMemo(() => {
		return getButtonsArray();
	}, [fileId, forList]);

	return (
		<>
			{isLoading ? (
				<Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
			) : (
				<ViwerWrapper buttons={buttons}>
					<MarkdownViewer markdownText={value} mt="4" />
				</ViwerWrapper>
			)}
		</>
	);
};

export default Viwer;
