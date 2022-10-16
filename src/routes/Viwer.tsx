import { Box, IconButton, Spinner } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import MarkdownViewer from '../components/Organisms/MarkdownViwer';
import { fetchFileById } from '../reducks/slice/fileListSlice';
import { useAppDispatch, useFileListSelector, useIsLoadingSelector } from '../reducks/hooks';
import { useNavigate } from 'react-router-dom';

const Viwer = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
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
			const target = files.list.find((file) => file.id === id);
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
				<Box maxWidth="840px" m="0 auto" px="5" pt="2">
					<IconButton
						aria-label="open new editor"
						icon={<ChevronLeftIcon w={6} h={6} />}
						colorScheme="teal"
						rounded="full"
						w="12"
						h="12"
						onClick={() => navigate(-1)}
					></IconButton>
					<MarkdownViewer markdownText={value} mt="4" />
				</Box>
			)}
		</>
	);
};

export default Viwer;
