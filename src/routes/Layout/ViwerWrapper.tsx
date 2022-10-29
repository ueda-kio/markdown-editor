import React from 'react';
import { Box, Flex, HStack, Icon, IconButton, Stack } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { RiInboxArchiveFill } from 'react-icons/ri';
import { FaEdit, FaCopy, FaTrash } from 'react-icons/fa';
import { useAppDispatch } from '../../reducks/hooks';
import { putFileInArchive, putFileInTrash } from '../../reducks/slice/fileListSlice';

type Props = {
	children: React.ReactNode;
};

const ViwerWrapper: React.FC<Props> = ({ children }) => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { fileId } = useParams();

	/** 削除処理 */
	const handleTrash = async () => {
		if (!fileId) return;
		await dispatch(putFileInTrash({ id: fileId }));
		navigate('/');
	};
	/** 削除処理 */
	const handleArchive = async () => {
		if (!fileId) return;
		await dispatch(putFileInArchive({ id: fileId }));
		navigate('/');
	};

	return (
		<Box maxWidth="840px" m="0 auto">
			<Flex
				as="header"
				pos="sticky"
				top="0"
				justifyContent={'space-between'}
				py="4"
				bg="linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 15%, rgba(255,255,255,1) 24%, rgba(255,255,255,1) 100%)"
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
					<IconButton
						aria-label="edit this file"
						icon={<Icon as={FaEdit} w={5} h={5} />}
						colorScheme="teal"
						rounded="full"
						w="12"
						h="12"
						onClick={() => navigate('./editor')}
					></IconButton>
					<IconButton
						aria-label="delete this file"
						icon={<Icon as={FaTrash} w={5} h={5} />}
						colorScheme="teal"
						rounded="full"
						w="12"
						h="12"
						onClick={handleTrash}
					></IconButton>
					<IconButton
						aria-label="archive this file"
						icon={<Icon as={RiInboxArchiveFill} w={5} h={5} />}
						colorScheme="teal"
						rounded="full"
						w="12"
						h="12"
						onClick={handleArchive}
					></IconButton>
				</HStack>
			</Flex>
			{children}
		</Box>
	);
};

export default ViwerWrapper;
