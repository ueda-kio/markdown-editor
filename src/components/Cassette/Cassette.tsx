import React from 'react';
import { Box, Text, Grid, chakra, useColorModeValue } from '@chakra-ui/react';
import { Link } from '../Atoms/Link';
import { css } from '@emotion/react';
import { FileType } from '../../reducks/slice/fileListSlice';
import { IconType } from 'react-icons';
import Popover from '../Organisms/Popover';

const style = {
	notTapHighlight: css`
		-webkit-tap-highlight-color: transparent;
	`,
};

type Props = {
	file: FileType;
	menus: {
		icon: IconType;
		onClick: ({ file }: { file: FileType }) => void;
		text: string;
	}[];
};

const Cassette: React.FC<Props> = ({ file, menus }) => {
	const { id, title, lead } = file;
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
			<Popover menuArray={menuArray} file={file} />
		</Box>
	);
};

export default Cassette;
