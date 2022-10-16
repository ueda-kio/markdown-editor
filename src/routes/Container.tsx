import React, { useEffect } from 'react';
import { Box, Button, IconButton, Spinner, Stack, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { PlusSquareIcon, SearchIcon } from '@chakra-ui/icons';
import Cassette from '../components/Cassette/Cassette';
import { useAppDispatch, useFileListSelector, useFilesSelector, useIsLoadingSelector } from '../reducks/hooks';
import { fetchFileList } from '../reducks/slice/fileListSlice';
import { db } from '../firebase';
import { trashFile } from '../libs/firebase.operation';
import { useNavigate } from 'react-router-dom';

const Container = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { files } = useFilesSelector();
	const { isLoading } = useIsLoadingSelector();

	useEffect(() => {
		if (files.isFetched === false) dispatch(fetchFileList());
	}, [files.isFetched]);

	const handleClick: React.MouseEventHandler = () => {
		const timestamp = new Date().toISOString();
		const ref = db.collection('files');
		const doc = ref.doc();
		const id = doc.id;
		const data = {
			id,
			value: '',
			created_at: timestamp,
			updated_at: timestamp,
			title: '',
			lead: '',
		};
		ref.doc(id)
			.set(data)
			.then(() => {
				navigate(`/file/${id}/editor`);
			})
			.catch((e) => console.error(e));
	};

	return (
		<Box position="relative" height="calc(100% - 68px)" pb="24" mt="5" _before={{ content: '""', display: 'block' }}>
			{isLoading ? (
				<Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
			) : (
				<Stack spacing="2" as="ol" height="100%" overflowY="auto" px="3">
					{files.list.map((file, i) => (
						<li key={`${file.id}_${i}`}>
							<Cassette file={file} />
						</li>
					))}
				</Stack>
			)}
			<IconButton
				aria-label="open new editor"
				icon={<PlusSquareIcon w={6} h={6} />}
				colorScheme="teal"
				rounded="full"
				position="fixed"
				bottom="4"
				right="4"
				w="16"
				h="16"
				onClick={handleClick}
			></IconButton>
		</Box>
	);
};

export default Container;
