import React from 'react';
import { SearchIcon } from '@chakra-ui/icons';
import { Input, InputGroup, InputLeftElement, useBreakpointValue } from '@chakra-ui/react';

const SearchInput = () => {
	const placeholderFontSize = useBreakpointValue({ base: '14px', md: '16px' });
	return (
		<InputGroup>
			<InputLeftElement
				top="50%"
				left="1"
				transform="translateY(-50%)"
				pointerEvents="none"
				children={<SearchIcon w={{ base: '4', md: '5' }} h={{ base: '4', md: '5' }} color="gray.400" />}
			/>
			<Input
				placeholder="Search"
				size="lg"
				h={{ base: '10', md: '12' }}
				rounded="3xl"
				fontSize={{ base: '14px', md: '16px' }}
				variant="filled"
				focusBorderColor="focusOutline"
				_placeholder={{ fontSize: placeholderFontSize }}
			/>
		</InputGroup>
	);
};

export default SearchInput;
