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
				children={<SearchIcon w={5} h={5} color="gray.400" />}
			/>
			<Input placeholder="search" size="lg" rounded="3xl" variant="filled" />
		</InputGroup>
	);
};

export default SearchInput;
