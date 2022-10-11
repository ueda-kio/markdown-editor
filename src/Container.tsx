import React, { useEffect } from 'react';
import { Box, Button, IconButton, Stack } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import Cassette from './components/Cassette/Cassette';
import { useAppDispatch, useFileListSelector, useIsLoadingSelector } from './reducks/hooks';
import { fetchFileList } from './reducks/slice/fileListSlice';
import { db } from './firebase';
import { trashFile } from './libs/firebase.operation';
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
		};
		ref.doc(id)
			.set(data)
			.then(() => {
				navigate(`/editor/${id}`);
			})
			.catch((e) => console.error(e));
	};

	return (
		<Box height="100%" position="relative">
			{isLoading ? (
				<>pending</>
			) : (
				<Stack spacing={4} as="ol">
					{fileList.files.map((file) => (
						<li key={file.id}>
							<Cassette file={file} />
						</li>
					))}
				</Stack>
			)}
			{/* <Button onClick={handleClick}>Button</Button>
			<Button onClick={() => navigate(`/editor/`)}>Fetch</Button>
			<Button onClick={() => trashFile('id')}>Trash</Button> */}
			<IconButton
				aria-label="open new editor"
				icon={<EditIcon w={6} h={6} />}
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
	);
};

export default Container;
