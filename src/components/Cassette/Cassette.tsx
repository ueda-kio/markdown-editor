import { Box, Text } from '@chakra-ui/react';
import React from 'react';

const Cassette = () => {
	return (
		<Box p={2.5} rounded="md" boxShadow="base" cursor="pointer" transition="box-shadow 0.3s" _hover={{ boxShadow: 'md' }}>
			<Text fontSize="lg">test</Text>
		</Box>
	);
};

export default Cassette;
