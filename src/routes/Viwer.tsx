import { Spinner } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import MarkdownViewer from '../components/Organisms/MarkdownViwer';
import { fetchFileById } from '../reducks/slice/fileListSlice';
import { useAppDispatch, useFileListSelector, useIsLoadingSelector } from '../reducks/hooks';

const Viwer = () => {
	const dispatch = useAppDispatch();
	const { fileList } = useFileListSelector();
	const { isLoading } = useIsLoadingSelector();
	const [value, setValue] = useState('');

	/** urlの末尾から取得したファイルid */
	const id = (() => {
		const endOfPath = location.pathname.split(/(.*)\//).filter((t) => t !== '')[1];
		if (endOfPath === '') return '';
		return endOfPath;
	})();

	/** urlのidと同じファイルをstateから取得する */
	const getFileById = useCallback(
		(id: string) => {
			const files = fileList.files;
			const target = files.find((file) => file.id === id);
			return target;
		},
		[id, fileList]
	);

	// ファイルのvalueをテキストエリアに反映
	useEffect(() => {
		(async () => {
			if (id === '') return;
			await dispatch(fetchFileById({ id }));
		})();
	}, [id]);

	useEffect(() => {
		const file = getFileById(id);
		if (!file) return;
		setValue(file.value);
	}, [fileList]);

	return (
		<>
			{isLoading ? (
				<Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
			) : (
				<MarkdownViewer markdownText={value} />
			)}
		</>
	);
};

export default Viwer;
