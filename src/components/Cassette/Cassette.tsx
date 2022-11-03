import React from 'react';
import {
	Box,
	Flex,
	Grid,
	Icon,
	IconButton,
	Text,
	chakra,
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverArrow,
	PopoverBody,
	VStack,
	StackDivider,
	useColorModeValue,
} from '@chakra-ui/react';
import { CopyIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { Link } from '../Atoms/Link';
import { css } from '@emotion/react';
import { FileType, putFileInTrash } from '../../reducks/slice/fileListSlice';
import { useAppDispatch } from '../../reducks/hooks';
import { IconType } from 'react-icons';
import IconLink from '../Atoms/IconLink';

const style = {
	notTapHighlight: css`
		-webkit-tap-highlight-color: transparent;
	`,
};

type Props = {
	file: FileType;
	icons: {
		icon: IconType;
		onClick: ({ file }: { file: FileType }) => void;
		text: string;
	}[];
};

const Cassette: React.FC<Props> = ({ file, icons }) => {
	const { id, title, lead } = file;
	const iconArray = (() =>
		icons.map((iconObj) => ({
			...iconObj,
			icon: chakra(iconObj.icon) as IconType,
		})))();

	return (
		<Box
			position="relative"
			rounded="md"
			border="1px"
			borderColor={'gray.300'}
			cursor="pointer"
			transition="background 0.15s"
			_hover={{ bg: useColorModeValue('gray.50', 'whiteAlpha.50') }}
			css={style.notTapHighlight}
		>
			<Link to={`/file/${id}`} display="block" px="4" py="5" lineHeight={'1.5'} {...{ '-webkit-tap-highlight-color': 'transparent' }}>
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
			<Popover>
				<PopoverTrigger>
					<IconButton
						position="absolute"
						top="50%"
						right="1rem"
						transform="translateY(-50%)"
						aria-label="open menu"
						rounded={'full'}
						bg="none"
						icon={<BsThreeDotsVertical />}
					>
						Trigger
					</IconButton>
				</PopoverTrigger>
				<PopoverContent cursor="default" border="1px" borderColor={'gray.300'} overflow="hidden" w="auto" minWidth="5xs">
					<VStack spacing="1" p="1">
						{iconArray.map((button) => (
							<IconLink
								to=""
								type="button"
								tag="button"
								icon={button.icon}
								onClick={() => button.onClick({ file })}
								p="3"
								pr="4"
								w="100%"
							>
								<Text fontWeight={'bold'} fontSize={'sm'}>
									{button.text}
								</Text>
							</IconLink>
						))}
					</VStack>
				</PopoverContent>
			</Popover>
		</Box>
	);
};

export default Cassette;
