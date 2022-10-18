import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, IconButton, Spinner, Stack, chakra } from '@chakra-ui/react';
import { PlusSquareIcon } from '@chakra-ui/icons';
import Cassette from '../components/Cassette/Cassette';
import { useAppDispatch, useIsLoadingSelector, useTrashesSelector } from '../reducks/hooks';
import { fetchTrashList } from '../reducks/slice/fileListSlice';
import { FaTrashRestore, FaTrash } from 'react-icons/fa';

const Trashes = () => {
	const dispatch = useAppDispatch();
	const { trashes } = useTrashesSelector();
	const { isLoading } = useIsLoadingSelector();
	const icons = [
		{
			icon: FaTrashRestore,
			onClick: () => {
				console.log('test');
			},
			ariaLabel: 'test-label',
		},
		{
			icon: FaTrash,
			onClick: () => {
				console.log('test');
			},
			ariaLabel: 'test-label',
		},
	];

	useEffect(() => {
		if (trashes.isFetched === false) dispatch(fetchTrashList());
	}, [trashes.isFetched]);

	return (
		<Box position="relative" height="calc(100% - 68px)" pb="24" mt="5" _before={{ content: '""', display: 'block' }}>
			{isLoading ? (
				<Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
			) : (
				<Stack spacing="2" as="ol" height="100%" overflowY="auto" px="3">
					{trashes.list.map((file, i) => (
						<li key={`${file.id}_${i}`}>
							<Cassette file={file} icons={icons} />
						</li>
					))}
				</Stack>
			)}
		</Box>
	);
};

export default Trashes;
