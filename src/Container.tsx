import React from 'react';
import { Stack } from '@chakra-ui/react';
import Cassette from './components/Cassette/Cassette';

const Container = () => {
	return (
		<>
			<Stack>
				{[0, 0, 0, 0].map((item) => (
					<Cassette />
				))}
			</Stack>
		</>
	);
};

export default Container;
