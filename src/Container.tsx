import React, { useEffect } from 'react';
import { Stack } from '@chakra-ui/react';
import Cassette from './components/Cassette/Cassette';
import { fetchFileList } from './libs/firebase.operation';
import { useAppDispatch, useFileListSelector } from './reducks/hooks';
import { setState } from './reducks/slice/fileListSlice';

const Container = () => {
	const dispatch = useAppDispatch();
	const { fileList } = useFileListSelector();

	useEffect(() => {
		(async () => {
			const data = await fetchFileList();
			console.log(data);
			dispatch(setState(data));
		})();
	}, []);

	return (
		<>
			<Stack spacing={4}>
				{fileList.files.map((item) => (
					<Cassette key={item.id} />
				))}
			</Stack>
		</>
	);
};

export default Container;
