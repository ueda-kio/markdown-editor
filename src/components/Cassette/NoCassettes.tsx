import { Box, Icon, Text } from '@chakra-ui/react';
import { AiOutlineFolderOpen } from 'react-icons/ai';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { BiArchiveIn } from 'react-icons/bi';
import { useCallback } from 'react';
import { FileListType } from '../../reducks/slice/fileListSlice';

type Props = {
	page: FileListType;
};

const NoCassettes: React.FC<Props> = ({ page }) => {
	const icon = useCallback(() => {
		switch (page) {
			case 'files':
				return AiOutlineFolderOpen;
			case 'trashes':
				return RiDeleteBin6Line;
			case 'archives':
				return BiArchiveIn;
		}
	}, [])();
	const message = useCallback(() => {
		switch (page) {
			case 'files':
				return 'No files created.';
			case 'trashes':
				return 'No files in the trash.';
			case 'archives':
				return 'No files in the archive.';
		}
	}, [])();
	return (
		<Box textAlign={'center'} pt="20">
			<Icon as={icon} w="24%" h="auto" color="gray.400"></Icon>
			<Text color="gray.400" fontWeight="bold" fontSize="2xl">
				{message}
			</Text>
		</Box>
	);
};

export default NoCassettes;
