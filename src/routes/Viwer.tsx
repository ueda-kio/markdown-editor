import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, IconButton, Spinner } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import MarkdownViewer from '../components/Organisms/MarkdownViwer';
import { fetchFileById, FileListType, FileType } from '../reducks/slice/fileListSlice';
import { useAppDispatch, useFileListSelector, useIsLoadingSelector } from '../reducks/hooks';
import ViwerWrapper from './Layout/ViwerWrapper';

const getFile = (fileObj: { list: FileType[]; isFetched: boolean }, id: string) => {
	return fileObj.list.find((file) => file.id === id);
};

const Viwer = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { files, trashes, archives } = useFileListSelector();
	const { isLoading } = useIsLoadingSelector();
	const [value, setValue] = useState('');
	const [forList, setForList] = useState<FileListType>('files');

	/** urlの末尾から取得したファイルid */
	const id = (() => {
		const endOfPath = location.pathname.split(/(.*)\//).filter((t) => t !== '')[1];
		if (endOfPath === '') return '';
		return endOfPath;
	})();

	/** urlのidと同じファイルをstateから取得する */
	const getFileById = useCallback(
		async (id: string) => {
			const forFiles = getFile(files, id);
			const forTrashes = getFile(trashes, id);
			const forArchives = getFile(archives, id);
			switch (true) {
				case typeof forFiles !== 'undefined': {
					return forFiles;
				}
				case typeof forTrashes !== 'undefined': {
					return forTrashes;
				}
				case typeof forArchives !== 'undefined': {
					return forArchives;
				}
				default: {
					const res = await dispatch(fetchFileById({ id })).unwrap();
					return res && res.data;
				}
			}
		},
		[id]
	);

	// ファイルのvalueをテキストエリアに反映
	useEffect(() => {
		(async () => {
			const file = await getFileById(id);
			if (!file) return;
			setValue(file.value);
		})();
	}, []);

	return (
		<>
			{isLoading ? (
				<Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
			) : (
				<ViwerWrapper>
					<MarkdownViewer markdownText={value} mt="4" />
				</ViwerWrapper>
			)}
		</>
	);
};

export default Viwer;
