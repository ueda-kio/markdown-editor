import React, { useEffect } from 'react';
import { Box, Button, IconButton, Spinner, Stack, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { PlusSquareIcon, SearchIcon } from '@chakra-ui/icons';
import Cassette from '../components/Cassette/Cassette';
import { useAppDispatch, useFileListSelector, useIsLoadingSelector } from '../reducks/hooks';
import { fetchFileList } from '../reducks/slice/fileListSlice';
import { db } from '../firebase';
import { trashFile } from '../libs/firebase.operation';
import { useNavigate } from 'react-router-dom';

const Container = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { fileList } = useFileListSelector();
	const { isLoading } = useIsLoadingSelector();

	useEffect(() => {
		dispatch(fetchFileList());
	}, []);

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
		<Box height="100%" maxWidth="1000px" mx="auto">
			<Box px="3">
				<InputGroup>
					<InputLeftElement
						top="50%"
						transform="translateY(-50%)"
						pointerEvents="none"
						children={<SearchIcon w={5} h={5} color="gray.400" />}
					/>
					<Input placeholder="search" size="lg" rounded="3xl" variant="filled" />
				</InputGroup>
			</Box>
			<Box position="relative" height="100%" pb="32" mt="5">
				{isLoading ? (
					<Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
				) : (
					<Stack spacing="2" as="ol" height="100%" overflowY="auto" px="3">
						{fileList.files.map((file) => (
							<li key={file.id}>
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
					width="20"
					height="20"
					onClick={handleClick}
				></IconButton>
			</Box>
		</Box>
	);
};

export default Container;
