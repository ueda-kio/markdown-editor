import React from 'react';
import { SearchIcon } from '@chakra-ui/icons';
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';

const SearchInput = () => {
	return (
		<InputGroup>
			<InputLeftElement
				top="50%"
				left="1"
				transform="translateY(-50%)"
				pointerEvents="none"
				children={<SearchIcon w={{ base: '4', md: '5' }} h={{ base: '4', md: '5' }} color="gray.400" />}
			/>
			<Input placeholder="search" size="lg" h={{ base: '10', md: '12' }} rounded="3xl" variant="filled" />
		</InputGroup>
	);
};

export default SearchInput;
