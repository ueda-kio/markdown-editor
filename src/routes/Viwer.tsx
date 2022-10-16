import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, IconButton, Spinner } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import MarkdownViewer from '../components/Organisms/MarkdownViwer';
import { fetchFileById } from '../reducks/slice/fileListSlice';
import { useAppDispatch, useFilesSelector, useIsLoadingSelector } from '../reducks/hooks';

const Viwer = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { files } = useFilesSelector();
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
		async (id: string) => {
			const target = (async () => {
				const _target = files.list.find((file) => file.id === id);
				if (_target) {
					return _target;
				}
				await dispatch(fetchFileById({ id }));
				return files.list.find((file) => file.id === id);
			})();
			return target;
		},
		[id, files]
	);

	// ファイルのvalueをテキストエリアに反映
	useEffect(() => {
		(async () => {
			const file = await getFileById(id);
			if (!file) return;
			setValue(file.value);
		})();
	}, [files]);

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
