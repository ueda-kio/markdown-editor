import React, { useEffect } from 'react';
import { Box, Flex, HStack, Icon, IconButton, Stack, useColorModeValue } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { RiInboxArchiveFill } from 'react-icons/ri';
import { FaEdit, FaCopy, FaTrash } from 'react-icons/fa';
import { useAppDispatch } from '../../reducks/hooks';
import { putFileInArchive, putFileInTrash } from '../../reducks/slice/fileListSlice';
import { IconType } from 'react-icons';

type Props = {
	buttons: {
		label: string;
		icon: IconType;
		handleClick: () => void;
	}[];
	children: React.ReactNode;
};

const ViwerWrapper: React.FC<Props> = ({ buttons, children }) => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { fileId } = useParams();

	return (
		<Box maxWidth="max" m="0 auto">
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
				<IconButton
					aria-label="open new editor"
					icon={<ChevronLeftIcon w={6} h={6} />}
					colorScheme="teal"
					rounded="full"
					w="12"
					h="12"
					onClick={() => navigate(-1)}
				></IconButton>
				<HStack spacing="2">
					{buttons.map((button) => (
						<IconButton
							key={button.label}
							aria-label={button.label}
							icon={<Icon as={button.icon} w={5} h={5} />}
							colorScheme="teal"
							rounded="full"
							w="12"
							h="12"
							onClick={button.handleClick}
						></IconButton>
					))}
				</HStack>
			</Flex>
			{children}
		</Box>
	);
};

export default ViwerWrapper;
