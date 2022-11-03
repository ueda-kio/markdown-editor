import React from 'react';
import { Box, Flex, IconButton, useColorModeValue } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { FileType } from '../../reducks/slice/fileListSlice';
import { IconType } from 'react-icons';
import Popover from '../../components/Organisms/Popover';

type Props = {
	menus: {
		text: string;
		icon: IconType;
		onClick: ({ file }: { file: FileType }) => void;
	}[];
	file: FileType;
	children: React.ReactNode;
};

const ViwerWrapper: React.FC<Props> = ({ file, menus, children }) => {
	const navigate = useNavigate();

	return (
		<Box maxWidth="max" mx="auto">
			<Flex
				as="header"
				pos="sticky"
				top="0"
				justifyContent={'space-between'}
				py="4"
				bg={useColorModeValue(
					'linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 15%, rgba(255,255,255,1) 24%, rgba(255,255,255,1) 100%)',
					'linear-gradient(0deg, rgba(26,32,44,0) 0%, rgba(26,32,44,0.9) 15%, rgba(26,32,44,1) 24%, rgba(26,32,44,1) 100%)'
				)}
			>
				<Popover file={file} menuArray={menus} />
				<IconButton
					aria-label="open new editor"
					icon={<ChevronLeftIcon w={6} h={6} />}
					colorScheme="teal"
					rounded="full"
					w="12"
					h="12"
					onClick={() => navigate(-1)}
				></IconButton>
			</Flex>
			{children}
		</Box>
	);
};

export default ViwerWrapper;
