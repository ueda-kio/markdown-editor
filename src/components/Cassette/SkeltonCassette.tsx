import React from 'react';
import { IconType } from 'react-icons';
import { Box, Text, Grid, chakra, useColorModeValue, BoxProps, Skeleton } from '@chakra-ui/react';
import { Link } from '../Atoms/Link';
import { FileType } from '../../reducks/slice/fileListSlice';
import Popover from '../Organisms/Popover';

const SkeltonCassette: React.FC<BoxProps> = ({ ...rest }) => {
	return (
		<Box position="relative" rounded="md" border="1px" borderColor={'gray.300'} {...rest}>
			<Box display="block" px={{ base: '3', md: '4' }} py={{ base: '4', md: '5' }} lineHeight={'1.5'}>
				<Grid templateColumns={{ base: '4fr 1fr', md: '4fr 1fr' }} gap={{ base: 3, md: '5' }} alignItems="center">
					<Box>
						<Skeleton minHeight={{ base: '24px', md: '27px' }} />
						<Skeleton minHeight={{ base: '42px', md: '48px' }} mt={2} />
					</Box>
				</Grid>
			</Box>
		</Box>
	);
};

export default SkeltonCassette;
