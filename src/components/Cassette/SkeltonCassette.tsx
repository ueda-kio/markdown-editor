import React from 'react';
import { Box, Grid, BoxProps, Skeleton, VStack } from '@chakra-ui/react';
import { useListTypeSelector } from '../../reducks/hooks';

const SkeltonCassette: React.FC<BoxProps> = ({ ...rest }) => {
	const { listType } = useListTypeSelector();
	return (
		<Box position="relative" rounded="md" border="1px" borderColor={'gray.300'} {...rest}>
			<Box display="block" px={{ base: '3', md: '4' }} py={{ base: '4', md: '5' }} lineHeight={'1.5'}>
				<Grid templateColumns={{ base: '4fr 1fr', md: '4fr 1fr' }} gap={{ base: 3, md: '5' }} alignItems="center">
					<Box>
						<Skeleton minHeight={{ base: '24px', md: '27px' }} />
						{listType === 'list' ? (
							<Skeleton minHeight={{ base: '42px', md: '48px' }} mt={2} />
						) : (
							<VStack mt="4" spacing="2">
								{['0', '1', '2'].map((el) => (
									<Skeleton key={el} w="100%" minHeight={{ base: '42px', md: '44px' }} />
								))}
							</VStack>
						)}
					</Box>
				</Grid>
			</Box>
		</Box>
	);
};

export default SkeltonCassette;
