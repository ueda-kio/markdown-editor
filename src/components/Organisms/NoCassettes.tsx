import { Box, Icon, Text } from '@chakra-ui/react';
import { AiOutlineFolderOpen } from 'react-icons/ai';
import { RiDeleteBin6Line } from 'react-icons/ri';

type Props = {
	page: 'files' | 'trashes';
};

const NoCassettes: React.FC<Props> = ({ page }) => {
	const icon = page === 'files' ? AiOutlineFolderOpen : RiDeleteBin6Line;
	return (
		<Box textAlign={'center'} pt="20">
			<Icon as={icon} w="24%" h="auto" color="gray.400"></Icon>
			<Text color="gray.400" fontWeight="bold" fontSize="2xl">
				{page === 'files' ? 'No files created' : 'No files in the trash'}
			</Text>
		</Box>
	);
};

export default NoCassettes;
