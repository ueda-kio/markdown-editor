import React from 'react';
import { Box, Flex, Grid, IconButton, Text, chakra } from '@chakra-ui/react';
import { CopyIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Link, useNavigate } from 'react-router-dom';
import { css } from '@emotion/react';
import { FileType, putFileInTrash } from '../../reducks/slice/fileListSlice';
import { useAppDispatch } from '../../reducks/hooks';
import { IconType } from 'react-icons';

const style = {
	link: css`
		display: block;
		padding: 1rem;
		line-height: 1.5;
	`,
};

type Props = {
	file: FileType;
	icons: {
		icon: IconType;
		onClick: (id: string) => void;
		ariaLabel: string;
	}[];
};

const Cassette: React.FC<Props> = ({ file, icons }) => {
	const { id, title, lead } = file;
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const handleEditClick = () => {
		navigate(`/file/${id}/editor/`);
	};
	const handleDeleteClick = (id: string) => {
		dispatch(putFileInTrash({ id }));
	};

	const iconArray = (() =>
		icons.map((iconObj) => ({
			icon: chakra(iconObj.icon),
			onClick: iconObj.onClick,
			ariaLabel: iconObj.ariaLabel,
		})))();

	return (
		<Box position="relative" rounded="md" boxShadow="base" cursor="pointer" transition="box-shadow 0.3s" _hover={{ boxShadow: 'md' }}>
			<Link to={`/file/${id}`} css={style.link}>
				<Grid templateColumns={{ base: '1fr 176px', md: '1fr 200px' }} gap={{ base: 3, md: '5' }} alignItems="center">
					<Box>
						<Text h="27px" fontSize="lg" fontWeight="bold" noOfLines={1}>
							{title}
						</Text>
						<Text h="48px" fontSize="md" mt={2} opacity="0.8" noOfLines={2}>
							{lead}
						</Text>
					</Box>
				</Grid>
			</Link>
			<Flex gap="4" position="absolute" top="50%" right="1rem" transform="translateY(-50%)">
				{iconArray.map((obj, i) => (
					<IconButton
						key={i}
						aria-label={obj.ariaLabel}
						icon={<obj.icon w={{ base: 4, md: 5 }} h={{ base: 4, md: 5 }} />}
						colorScheme="teal"
						rounded="full"
						width={{ base: 12, md: 14 }}
						height={{ base: 12, md: 14 }}
						onClick={() => obj.onClick(id)}
					></IconButton>
				))}
				{/* <IconButton
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
					onClick={() => handleDeleteClick(id)}
				></IconButton>
				<IconButton
					aria-label="open new editor"
					icon={<CopyIcon w={{ base: 4, md: 5 }} h={{ base: 4, md: 5 }} />}
					colorScheme="teal"
					rounded="full"
					width={{ base: 12, md: 14 }}
					height={{ base: 12, md: 14 }}
				></IconButton> */}
			</Flex>
		</Box>
	);
};

export default Cassette;
