import React from 'react';
import { Box, Flex, Grid, IconButton, Text } from '@chakra-ui/react';
import { CopyIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Link, useNavigate } from 'react-router-dom';
import { css } from '@emotion/react';
import { FileType } from '../../reducks/slice/fileListSlice';

const style = {
	link: css`
		display: block;
		padding: 1rem;
		line-height: 1.5;
	`,
};

type Props = {
	file: FileType;
};

const Cassette: React.FC<Props> = ({ file }) => {
	const { id, title, lead } = file;
	const navigate = useNavigate();
	const handleEditClick = () => {
		navigate(`/file/${id}/editor/`);
	};

	return (
		<Box position="relative" rounded="md" boxShadow="base" cursor="pointer" transition="box-shadow 0.3s" _hover={{ boxShadow: 'md' }}>
			<Link to={`/file/${id}`} css={style.link}>
				<Grid templateColumns={{ base: '1fr 176px', md: '1fr 200px' }} gap={{ base: 3, md: '5' }} alignItems="center">
					<Box>
						<Text fontSize="lg" fontWeight="bold" noOfLines={1}>
							{title}
						</Text>
						<Text fontSize="md" mt={2} opacity="0.8" noOfLines={2}>
							{lead}
						</Text>
					</Box>
				</Grid>
			</Link>
			<Flex gap="4" position="absolute" top="50%" right="1rem" transform="translateY(-50%)">
				<IconButton
					aria-label="open new editor"
					icon={<EditIcon w={{ base: 4, md: 5 }} h={{ base: 4, md: 5 }} />}
					colorScheme="teal"
					rounded="full"
					width={{ base: 12, md: 14 }}
					height={{ base: 12, md: 14 }}
					onClick={handleEditClick}
				></IconButton>
				<IconButton
					aria-label="open new editor"
					icon={<DeleteIcon w={{ base: 4, md: 5 }} h={{ base: 4, md: 5 }} />}
					colorScheme="teal"
					rounded="full"
					width={{ base: 12, md: 14 }}
					height={{ base: 12, md: 14 }}
				></IconButton>
				<IconButton
					aria-label="open new editor"
					icon={<CopyIcon w={{ base: 4, md: 5 }} h={{ base: 4, md: 5 }} />}
					colorScheme="teal"
					rounded="full"
					width={{ base: 12, md: 14 }}
					height={{ base: 12, md: 14 }}
				></IconButton>
			</Flex>
		</Box>
	);
};

export default Cassette;
