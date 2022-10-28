import React from 'react';
import { Box, IconButton } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

type Props = {
	children: React.ReactNode;
};

const ViwerWrapper: React.FC<Props> = ({ children }) => {
	const navigate = useNavigate();
	return (
		<Box maxWidth="840px" m="0 auto" px="5" pt="2">
			<IconButton
				aria-label="open new editor"
				icon={<ChevronLeftIcon w={6} h={6} />}
				colorScheme="teal"
				rounded="full"
				w="12"
				h="12"
				onClick={() => navigate(-1)}
			></IconButton>
			{children}
		</Box>
	);
};

export default ViwerWrapper;
