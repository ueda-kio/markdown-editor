import React from 'react';
import { IconType } from 'react-icons';
import { Box, Text, Grid, chakra, useColorModeValue, BoxProps } from '@chakra-ui/react';
import { Link } from '../Atoms/Link';
import { FileType } from '../../reducks/slice/fileListSlice';
import Popover from '../Organisms/Popover';

type Props = {
	file: FileType;
	menus: {
		icon: IconType;
		onClick: ({ file }: { file: FileType }) => void;
		text: string;
	}[];
	_ref?: React.RefObject<HTMLDivElement>;
} & BoxProps;

const Cassette: React.FC<Props> = ({ file, menus, _ref, ...rest }) => {
	const { id, title, lead } = file;
	//TODO useCallBack?
	const menuArray = (() =>
		menus.map((menu) => ({
			...menu,
			icon: chakra(menu.icon) as IconType,
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
			ref={_ref}
			{...rest}
		>
			<Link to={`/file/${id}`} display="block" px={{ base: '3', md: '4' }} py={{ base: '4', md: '5' }} lineHeight={'1.5'}>
				<Grid templateColumns={{ base: '4fr 1fr', md: '4fr 1fr' }} gap={{ base: 3, md: '5' }} alignItems="center">
					<Box>
						<Text
							minHeight={{ base: '24px', md: '27px' }}
							fontSize={{ base: '16px', md: '18px' }}
							fontWeight="bold"
							noOfLines={1}
						>
							{title}
						</Text>
						<Text
							minHeight={{ base: '42px', md: '48px' }}
							fontSize={{ base: 'sm', md: 'md' }}
							mt={2}
							opacity="0.8"
							noOfLines={2}
						>
							{lead}
						</Text>
					</Box>
				</Grid>
			</Link>
			<Popover menuArray={menuArray} file={file} />
		</Box>
	);
};

export default Cassette;
